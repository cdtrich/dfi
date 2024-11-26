library(dplyr)
library(tidyr)
library(readr)
library(googlesheets4)
library(stringr)

# data <- read_csv("C:/Users/dietr/Downloads/dfi.csv") %>%
data <- read_csv("dfi_grid.csv") %>%
  print()

grid_commitment <- grid %>%
  filter(name == "commitment_num") %>%
  distinct(NAME_ENGL, commitment_txt, .keep_all = TRUE)

cat(format_csv(grid_commitment))
write_csv(grid_commitment, "dfi_grid_commitment.csv")
