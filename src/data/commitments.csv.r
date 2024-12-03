library(dplyr)
library(readr)
library(googlesheets4)
library(stringr)

commitments_url <- "https://docs.google.com/spreadsheets/d/1L75x-czNhkJK441I2ip746UZ02XG-EKMGpsY2-JdMjg/edit?usp=sharing"

commitments <- googlesheets4::read_sheet(commitments_url)

commitments_ed <- commitments %>%
    # generate icon urls
    mutate(icon_url = paste0("https://raw.githubusercontent.com/cdtrich/dfi/31dd713cd80fedd810e802e95bc4e0c84cae88e3/icons/icon_", commitment_num, ".svg"))
# pull(value) %>%
# range() %>%
# print()

cat(format_csv(commitments_ed))
write_csv(commitments_ed, "commitments.csv")
