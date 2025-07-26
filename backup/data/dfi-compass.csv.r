library(dplyr)
library(tidyr)
library(readr)
library(readxl)
library(stringr)

# READ ALL DATA FILES ---------------------------------------------------------

# Read the file
df <- read_excel("data/Internet Accountability Index-V2.xlsx",
    sheet = "By Pillar"
)

df_long <- df %>%
    # long form
    pivot_longer(
        `Positive Obligations`:`Enabling Environment`,
        names_to = "pillar_txt",
        values_to = "value"
    ) %>%
    # make all numeric
    # detect not enough data comments
    mutate(
        note_total = ifelse(
            `Total Index Score` == "Not enough data",
            "Not enough data",
            NA
        ),
        note = ifelse(
            value == "Not enough data",
            "Not enough data",
            NA
        ),
        `Total Index Score` = ifelse(
            `Total Index Score` == "Not enough data",
            NA,
            as.numeric(`Total Index Score`)
        ),
        value = ifelse(
            value == "Not enough data",
            NA,
            as.numeric(value)
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
write_csv(dfi_clean, "dfi-compass.csv")
