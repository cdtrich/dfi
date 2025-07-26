library(dplyr)
library(tidyr)
library(readr)
library(readxl)
library(stringr)

# READ ALL DATA FILES ---------------------------------------------------------

# Read the file
df <- read_excel("data/Internet Accountability Index-V2.xlsx",
    sheet = "Full Index by indicator", na = "NA"
)

df_long <- df %>%
    dplyr::select(Countries:`Total Index Score`) %>%
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
            labels = c("Below average", "Average", "Above Average", "Pioneers")
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
    # drop values without total
    drop_na(total) %>%
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
        pillar_num_cardinal = case_match(
            pillar_num,
            1 ~ 4,
            2 ~ 2,
            3 ~ 1,
            4 ~ 3
        ),
        pillar_txt = case_match(
            pillar_num_cardinal,
            1 ~ "Positive Obligations",
            2 ~ "Human Rights",
            3 ~ "Negative Obligations",
            4 ~ "Enabling Environment"
        ),
        commitment_num_cardinal = case_match(commitment_num,
            1 ~ 10,
            2 ~ 11,
            3 ~ 12,
            7 ~ 1,
            8 ~ 2,
            9 ~ 3,
            10 ~ 7,
            11 ~ 8,
            12 ~ 9,
            .default = commitment_num
        ),
        commitment_txt_cardinal = case_match(
            commitment_num,
            1 ~ "ICT Development Index (ITU)",
            2 ~ "Global Cybersecurity Index (ITU)",
            3 ~ "Network Readiness Index (Portulans / Oxford)",
            4 ~ "Global Internet Shutdowns (ISOC Pulse)",
            5 ~ "Global E-Waste Monitor (ITU)",
            6 ~ "Overall Resilience (Internet Society Pulse)",
            7 ~ "Freedom on the Net (Freedom House)",
            8 ~ "Global index on Responsible AI (GCG)",
            9 ~ "Global Cyberlaw Tracker (UNCTAD)",
            10 ~ "Rule of Law Index (World Justice Project)",
            11 ~ "Freedom of Expression Index (V-Dem)",
            12 ~ "Accountability Index (V-Dem)"
        )
    ) %>%
    group_by(NAME_ENGL) %>%
    # facets
    mutate(
        fx = (cur_group_id()) %% 6,
        fy = (cur_group_id()) %/% 6
    ) %>%
    ungroup() %>%
    arrange(NAME_ENGL, pillar_num_cardinal, commitment_num_cardinal)
# normalize values
# group_by(key) |>
# mutate(
#     max_value = max(value, na.rm = TRUE),
#     normalized = value / max_value
# ) |>
# ungroup() |>
# select(-max_value) |>
#  dfi_clean %>% filter(is.na(group))

# cat(format_csv(commitments_ed))
# write_csv(commitments_ed, "commitments.csv")

cat(format_csv(dfi_clean))
# write_csv(dfi_clean, "dfi_polar.csv")
