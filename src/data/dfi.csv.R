library(dplyr)
library(readr)
library(googlesheets4)
library(stringr)

dataAll_url <- "https://docs.google.com/spreadsheets/d/1pFIy0yURWQ2PqKYWVWR2w2Ohuf9EKDD57V3qkX-L5jc/edit?gid=1588518598#gid=1588518598"

dfi <- googlesheets4::read_sheet(dataAll_url)

dfi_ed <- dfi %>%
    # sanitize country name
    mutate(countryClean = str_remove_all(NAME_ENGL, "[^[:alnum:]]")) %>%
    mutate(countryClean = iconv(countryClean, from = "UTF-8", to = "ASCII//TRANSLIT")) %>%
    # generate urls
    mutate(country_url = paste0("./countries/", str_remove_all(countryClean, " "))) %>%
    mutate(pillar_url = paste0("./pillars/", str_remove_all(pillar, " "))) %>%
    dplyr::select(-countryClean) %>%
    # normalize
    group_by(commitment_txt) %>%
    mutate(
        value = 100 * (value - min) / (max - min),
        value = ifelse(min > max, 100 - value, value)
    ) %>%
    ungroup() %>%
    # arrange alphabetically
    arrange(NAME_ENGL)
# pull(value) %>%
# range() %>%
# print()

cat(format_csv(dfi_ed))
write_csv(dfi_ed, "dfi.csv")
