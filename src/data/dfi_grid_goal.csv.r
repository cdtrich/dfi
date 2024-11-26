library(dplyr)
library(tidyr)
library(readr)
library(googlesheets4)
library(stringr)

# data <- read_csv("C:/Users/dietr/Downloads/dfi.csv") %>%
data <- read_csv("dfi_grid.csv") %>%
  print()

grid_goal <- grid %>%
  filter(name == "goal_num") %>%
  distinct(NAME_ENGL, goal, .keep_all = TRUE)

# grid_pillar <- grid %>%
#   filter(name == "pillar_num") %>%
#   distinct(NAME_ENGL, pillar, .keep_all = TRUE)

# grid_commitment <- grid %>%
#   filter(name == "commitment_num") %>%
#   distinct(NAME_ENGL, commitment_txt, .keep_all = TRUE)

cat(format_csv(grid_goal))
write_csv(grid_goal, "dfi_grid_goal.csv")
