library(dplyr)
library(tidyr)
library(readr)
library(readxl)
library(stringr)

# READ ALL DATA FILES ---------------------------------------------------------

# Read the file
df <- read_excel("data/Internet Accountability Index-V5.xlsx",
    sheet = "Full Index by indicator 21-07", na = "NA"
)

df_long <- df %>%
    dplyr::select(Countries:`Total index score`) %>%
    # make all numeric
    mutate(
        across(
            c(`Indicator 1-1`:`Indicator 4-12`),
            as.numeric
        )
    ) %>%
    # long form
    pivot_longer(
        `Indicator 1-1`:`Indicator 4-12`,
        names_to = "commitment_num",
        values_to = "value"
    ) %>%
    # keep commitment text
    mutate(commitment_txt = commitment_num) %>%
    # slice indicator into pillar and commitment
    separate(
        commitment_num,
        into = c("pillar_num", "commitment_num"),
        sep = "-",
        convert = TRUE
    ) %>%
    mutate(
        pillar_num = str_remove(
            pillar_num, "Indicator "
        ),
        pillar_num = as.numeric(pillar_num)
    ) %>%
    # detect not enough data comments
    mutate(
        note = ifelse(
            `Total Index Score` == "Not enough data",
            "Not enough data",
            NA
        ),
        `Total Index Score` = ifelse(
            `Total Index Score` == "Not enough data",
            NA,
            as.numeric(`Total Index Score`)
        )
    )
# drop all missing values
# if dropped, dynamic position of spikes needs to be revised
# drop_na(value)

# CLEAN COUNTRY NAMES ---------------------------------------

# replacement characters
replacements <- c("é" = "e", "ê" = "e", "à" = "a", "/" = "-")

df_rename <- df_long %>%
    # rename var names
    rename(
        NAME_ENGL = Countries,
        total = `Total Index Score`,
    )

dfi_clean <- df_rename %>%
    # generate urls
    mutate(country_url = paste0("countries/", str_to_lower(ISO3_CODE))) %>%
    # Adding a sequential count for commitments within each pillar
    group_by(pillar_num, commitment_num) %>%
    mutate(row_id = row_number()) %>% # Count rows within pillar-commitment pairs
    ungroup() %>%
    # sequential count for commitments within each pillar
    group_by(pillar_num) %>%
    mutate(x = cumsum(!duplicated(commitment_num))) %>%
    ungroup() %>%
    # adding some jitter to y for integer values
    mutate(y = jitter(value, amount = 2)) %>%
    arrange(NAME_ENGL)

# cat(format_csv(commitments_ed))
# write_csv(commitments_ed, "commitments.csv")

cat(format_csv(dfi_clean))
# write_csv(dfi_clean, "dfi.csv")
