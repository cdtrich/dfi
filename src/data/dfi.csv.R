library(dplyr)
library(readr)
library(googlesheets4)
library(stringr)

# main dataset
dataAll_url <- "https://docs.google.com/spreadsheets/d/1pFIy0yURWQ2PqKYWVWR2w2Ohuf9EKDD57V3qkX-L5jc/edit?gid=1588518598#gid=1588518598"

dfi <- googlesheets4::read_sheet(dataAll_url)

# replacement characters
replacements <- c("é" = "e", "ê" = "e", "à" = "a")

dfi_ed <- dfi %>%
    # sanitize country name
    mutate(countryClean = str_remove_all(NAME_ENGL, "[^[:alnum:]]")) %>%
    mutate(countryClean = str_remove_all(NAME_ENGL, ",")) %>%
    mutate(countryClean = str_replace_all(NAME_ENGL, replacements)) %>%
    mutate(countryClean = iconv(countryClean, from = "UTF-8", to = "ASCII//TRANSLIT")) %>%
    # generate urls
    mutate(country_url = paste0("./countries/", str_remove_all(countryClean, " "))) %>%
    mutate(pillar_url = paste0("./pillars/", str_remove_all(pillar, " "))) %>%
    mutate(goal_url = paste0("./goals/", str_remove_all(goal, " "))) %>%
    # mutate(icon_url = paste0("https://raw.githubusercontent.com/cdtrich/dfi/31dd713cd80fedd810e802e95bc4e0c84cae88e3/icons/icon_", commitment_num, ".svg")) %>%
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

# commitments

commitments_url <- "https://docs.google.com/spreadsheets/d/1L75x-czNhkJK441I2ip746UZ02XG-EKMGpsY2-JdMjg/edit?usp=sharing"

commitments <- googlesheets4::read_sheet(commitments_url)

commitments_ed <- commitments %>%
    mutate(icon_url = paste0("https://raw.githubusercontent.com/cdtrich/dfi/refs/heads/main/icons/icon_", commitment_num, ".svg"))

dfi_join <- dfi_ed %>%
    # head() %>%
    select(-commitment_txt) %>%
    select(-pillar_num) %>%
    left_join(commitments_ed,
        by = "commitment_num"
    )

# cat(format_csv(commitments_ed))
# write_csv(commitments_ed, "commitments.csv")

cat(format_csv(dfi_join))
write_csv(dfi_join, "dfi.csv")
