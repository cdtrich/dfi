library(dplyr)
library(readr)
library(googlesheets4)
library(stringr)

dataAll_url <- "https://docs.google.com/spreadsheets/d/1D-bF8-BNrU6-Y52Ihs53oEzwcg4XC4Y_tr5tti1-dns/edit?gid=2084165495#gid=2084165495"

goodpractice <- googlesheets4::read_sheet(dataAll_url)

goodpractice_ed <- goodpractice %>%
    mutate(
        # url for country page with good practice anchor
        country_url = paste0("./countries/", str_remove_all(NAME_ENGL, " "), "#goodpractice"),
        # treemap path
        path = paste0(NAME_ENGL, ".", pillar, ".", document)
    )

cat(format_csv(goodpractice_ed))
write_csv(goodpractice_ed, "goodpractice.csv")
