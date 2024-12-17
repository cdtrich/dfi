library(dplyr)
library(readr)
library(readxl)
# library(googlesheets4)
library(stringr)

goals <- read_excel("data/commitments_pillars_goals.xlsx",
    sheet = 2
)

# goals_ed <- goals %>%
#     # generate the path of the hierarchy
#     mutate(tree = paste0(pillar, "/", commitment_txt, "/", goal))
# # add a root

cat(format_csv(goals))
write_csv(goals, "goals.csv")
