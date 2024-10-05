library(dplyr)
library(tidyr)
library(sf)
library(giscoR)
library(geojsonio)
library(googlesheets4)
library(stringr)

# dataAll_url <- "C:/Users/dietr/OneDrive/cd_trich/freelance/EUI/2024 state of the internet/data/data.csv"
# dataAll_url <- "src/data/data.csv"
dataAll_url <- "https://docs.google.com/spreadsheets/d/1pFIy0yURWQ2PqKYWVWR2w2Ohuf9EKDD57V3qkX-L5jc/edit?gid=1588518598#gid=1588518598"

countries <- gisco_get_countries(
    year = "2020",
    epsg = "4326",
    update_cache = TRUE,
    resolution = "60",
    spatialtype = "RG"
) %>%
    dplyr::select(ISO3_CODE)

topo <- googlesheets4::read_sheet(dataAll_url) %>%
    # drop columns that keep from widening
    select(c(-pillar, -commitment_num)) %>%
    # make indicator names valid
    mutate(indicator = str_remove(pillar, "_")) %>%
    # make it wide
    pivot_wider(
        names_from = indicator,
        values_from = val,
    ) %>%
    left_join(
        countries,
        by = "ISO3_CODE"
    ) %>%
    st_as_sf()

world <- geojsonio::topojson_json(topo)
cat(world)
