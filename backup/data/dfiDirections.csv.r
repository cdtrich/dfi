library(dplyr)
library(tidyr)
library(readr)
library(readxl)
library(stringr)

# READ ALL DATA FILES ---------------------------------------------------------

# Read the file
cardinals <- read_excel(paste0(here(), "/src/data/Internet Accountability Index-V3.xlsx"),
    sheet = "Full Index by indicator 01-04", na = "NA"
) %>%
    names() %>%
    tibble() %>%
    rename(name = 1) %>%
    filter(!str_detect(name, "\\."))

cat(format_csv(cardinals))
# write_csv(dfi_clean, "dfi_polar.csv")
