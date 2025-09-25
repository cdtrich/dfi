library(dplyr)
library(tidyr)
library(readr)
library(readxl)
library(stringr)
library(here)

# READ ALL DATA FILES ---------------------------------------------------------

# Read the file
df <- read_excel(paste0(here(), "/src/data/Internet Accountability Index-V5.xlsx"),
    sheet = "By Pillar 21-07"
) %>%
    bind_cols(read_excel(paste0(here(), "/src/data/Internet Accountability Index-V5.xlsx"),
        sheet = "Full Index by indicator 21-07", na = "NA",
        skip = 2
    ) %>% select(`Total Index Score`))

df_long <- df %>%
    # long form
    pivot_longer(
        3:6,
        names_to = "pillar_txt",
        values_to = "value"
    ) %>%
    # make all numeric
    # detect not enough data comments
    mutate(
        note_total = ifelse(
            str_detect(`Total Index Score`, "ot enough data"),
            "Not enough data",
            NA
        ),
        note = ifelse(
            str_detect(value, "ot enough data"),
            "Not enough data",
            NA
        ),
        `Total Index Score` = ifelse(
            str_detect(`Total Index Score`, "ot enough data"),
            NA,
            as.numeric(`Total Index Score`)
        ),
        value = ifelse(
            value == "Not enough data",
            NA,
            as.numeric(value)
        ),
        group_value = cut(value,
            breaks = c(-Inf, 50, 65, 79, Inf),
            labels = c("Off track", "Getting on track", "On track", "Leading")
        ),
        group = cut(`Total Index Score`,
            breaks = c(-Inf, 50, 65, 79, Inf),
            labels = c("Off track", "Getting on track", "On track", "Leading")
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
        total = `Total Index Score`
        # note = `Notes on missing Indicators`
    )

dfi_clean <- df_rename %>%
    # generate urls
    mutate(country_url = paste0("countries/", str_to_lower(ISO3_CODE)))

# cat(format_csv(commitments_ed))
# write_csv(commitments_ed, "commitments.csv")

cat(format_csv(dfi_clean))
# write_csv(dfi_clean, "dfi-compass.csv")
