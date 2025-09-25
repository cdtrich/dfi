library(dplyr)
library(tidyr)
library(readxl)
library(readr)
library(stringr)

# read data
sources <- read_excel("./data/Sources-sep24.xlsx") %>%
    # select and clean names
    select(1:9) %>%
    rename(
        type = Type,
        title = document
    ) %>%
    # only entries with titles (for cards)
    drop_na(type) %>%
    mutate(
        icon = case_match(
            type,
            "Analysis" ~ "📄︎",
            "Source" ~ "🔍︎",
            "Project" ~ "📌︎",
            .default = type
        ),
        type = paste0(icon, " ", type),
        title = paste0(icon, " ", title)
    )

# write data
cat(format_csv(sources))
write_csv(sources, "sources.csv")
