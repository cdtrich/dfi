library(rnaturalearth)
library(dplyr)
library(stringr)
library(sf)
library(readr)
source("C:/Users/dietr/OneDrive/R/euiss_helpers/euiss_gisco.R")

ne_countries() %>% 
  st_drop_geometry() %>% 
  select(iso_a3, continent, region_un) %>% 
  left_join(euiss_gisco(res = "01") %>% 
              st_drop_geometry(),
            by = c("iso_a3" = "ISO3_CODE")) %>% 
  select(ISO3_CODE = iso_a3, NAME_ENGL, continent, region_un) %>% 
  # print()
  write_csv("iso with regions.csv")

