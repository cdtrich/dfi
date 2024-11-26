library(dplyr)
library(tidyr)
library(readr)
library(googlesheets4)
library(stringr)

# data <- read_csv("C:/Users/dietr/Downloads/dfi.csv") %>%
data <- read_csv("dfi_grid.csv") %>%
  print()

grid_pillar <- grid %>%
  filter(name == "pillar_num") %>%
  distinct(NAME_ENGL, pillar, .keep_all = TRUE)

cat(format_csv(grid_pillar))
write_csv(grid_pillar, "dfi_grid_pillar.csv")
