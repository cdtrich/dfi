library(dplyr)
library(readr)
library(googlesheets4)
library(stringr)

dataAll_url <- "https://docs.google.com/spreadsheets/d/18WwHKZw9nTpUAi0RBz5gH5ci6DnyBanT3f8CSN3thjo/edit?usp=sharing"

goals <- googlesheets4::read_sheet(dataAll_url)

goals_ed <- goals %>%
    # generate the path of the hierarchy
    mutate(tree = paste0(pillar, "/", commitment_txt, "/", goal))
# add a root

cat(format_csv(goals_ed))
write_csv(goals_ed, "goals.csv")
