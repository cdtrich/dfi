library(dplyr)
library(tidyr)
library(readr)
library(readxl)
library(stringr)
library(here)

# READ ALL DATA FILES ---------------------------------------------------------

# Read the file
df <- read_excel(paste0(here(), "/src/data/Internet Accountability Index-V5.xlsx"),
    sheet = "Full Index by indicator 21-07", na = "NA",
    skip = 2
)

indicators <- read_excel(paste0(here(), "/src/data/Internet Accountability Index-V5.xlsx"),
    sheet = "Full Index by indicator 21-07", na = "NA"
) %>%
    slice(1) %>%
    select(3:14) %>%
    pivot_longer(1:12) %>%
    pull(value)

cardinals <- read_excel(paste0(here(), "/src/data/Internet Accountability Index-V5.xlsx"),
    sheet = "Full Index by indicator 21-07", na = "NA"
) %>%
    names() %>%
    tibble() %>%
    rename(name = 1) %>%
    filter(!str_detect(name, "\\.")) %>%
    pull()

df_long <- df %>%
    dplyr::select(Countries:`Total Index Score`) %>%
    # make all numeric
    mutate(
        across(
            3:14,
            as.numeric
        )
    ) %>%
    # long form
    pivot_longer(
        3:14,
        names_to = "commitment_num",
        values_to = "value"
    ) %>%
    # keep commitment text
    mutate(
        commitment_txt = str_remove(commitment_num, " \\(new\\)"),
        commitment_txt = str_remove(commitment_txt, "Indicator ")
    ) %>%
    # slice indicator into pillar and commitment
    separate(
        commitment_txt,
        into = c("pillar_num", "commitment_num"),
        sep = "-",
        convert = TRUE
    ) %>%
    mutate(
        pillar_num = as.numeric(pillar_num),
        # substring b/c of FH header
        commitment_num = as.numeric(str_sub(commitment_num, 1, 2))
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
        ),
        # slice groups
        group = cut(`Total Index Score`,
            breaks = c(-Inf, 50, 65, 79, Inf),
            labels = c("Off track", "Catching up", "On track", "Leading")
        ),
        group_value = cut(value,
            breaks = c(-Inf, 50, 65, 79, Inf),
            labels = c("Off track", "Catching up", "On track", "Leading")
        )
    )

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
    # drop values without total
    tidyr::drop_na(total) %>%
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
    arrange(NAME_ENGL) %>%
    # cardinal lookup
    mutate(
        pillar_num_cardinal = pillar_num,
        # case_match(
        #     pillar_num,
        #     1 ~ 1,
        #     2 ~ 3,
        #     3 ~ 2,
        #     4 ~ 4
        # ),
        pillar_txt = case_match(
            pillar_num_cardinal,
            1 ~ cardinals[1],
            2 ~ cardinals[2],
            3 ~ cardinals[3],
            4 ~ cardinals[4]
        ),
        commitment_num_cardinal = commitment_num,
        # commitment_num_cardinal = case_match(commitment_num,
        #     1 ~ 10,
        #     2 ~ 11,
        #     3 ~ 12,
        #     4 ~ 4,
        #     5 ~ 5,
        #     6 ~ 6,
        #     7 ~ 7,
        #     8 ~ 8,
        #     9 ~ 9,
        #     10 ~ 1,
        #     11 ~ 2,
        #     12 ~ 3,
        #     .default = commitment_num
        # ),
        commitment_txt_cardinal = case_match(
            commitment_num,
            1 ~ indicators[1],
            2 ~ indicators[2],
            3 ~ indicators[3],
            4 ~ indicators[4],
            5 ~ indicators[5],
            6 ~ indicators[6],
            7 ~ indicators[7],
            8 ~ indicators[8],
            9 ~ indicators[9],
            10 ~ indicators[10],
            11 ~ indicators[11],
            12 ~ indicators[12],
        )
    ) %>%
    group_by(NAME_ENGL) %>%
    # facets
    mutate(
        fx = (cur_group_id()) %% 5,
        fy = (cur_group_id()) %/% 5
    ) %>%
    ungroup() %>%
    arrange(NAME_ENGL, pillar_num_cardinal, commitment_num_cardinal)

cat(format_csv(dfi_clean))
# write_csv(dfi_clean, "dfi_polar.csv")
