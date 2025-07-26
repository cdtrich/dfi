library(dplyr)
library(tidyr)
library(readxl)
library(readr)
library(stringr)

# read data
sources <- read_excel("./data/Sources-Jul25.xlsx") %>%
    # select and clean names
    select(1:9) %>%
    rename(
        type = Type,
        title = document
    ) %>%
    # only entries with titles (for cards)
    drop_na(type)

# write data
cat(format_csv(sources))
write_csv(sources, "sources.csv")
