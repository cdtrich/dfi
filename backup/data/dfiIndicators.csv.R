library(dplyr)
library(tidyr)
library(readr)
library(readxl)
library(stringr)

# READ ALL DATA FILES ---------------------------------------------------------

# Read the file
df <- read_excel(paste0(here(), "/src/data/Internet Accountability Index-V3.xlsx"),
    sheet = "Full Index by indicator 01-04", na = "NA"
) %>%
    slice(1) %>%
    select(3:14) %>%
    pivot_longer(1:12)

cat(format_csv(df))
# write_csv(dfi_clean, "dfi_polar.csv")
