# javascript might be better!!!
# https://dev.to/jameswallis/combining-markdown-and-dynamic-routes-to-make-a-more-maintainable-next-js-website-3ogl

library(dplyr)
library(readr)
library(stringr)
library(foreach)
# library(googlesheets4)

# generatePillarPages
getwd()
# go up one folder
# setwd("..")

data <- read_csv("src/.observablehq/cache/data/dfi.csv") %>%
    print()

pillar <- data %>%
    distinct(pillar) %>%
    pull()

pillar_url <- pillar %>%
    str_remove_all(" ")

# read md template
breakFun <- function(x) {
    # function to replace empty lines with newline.
    if (nchar(x) == 0) {
        return("\n\n") # double newline to give same space as in the .md-file
    } else {
        return(x)
    }
}

storeLines <- readLines("src/pillars/1pillarPageTemplate.md")

foreach(i = 1:length(pillar)) %do% {
    cleanLines <- storeLines %>%
        str_replace_all("plr", pillar[i])

    pillarLines <- cleanLines %>%
        # paste0(lapply(storeLines, FUN = function(x) breakFun(x)), collapse = "") %>%
        str_replace_all("plr", pillar[i])

    write_lines(
        pillarLines,
        paste0("src/pillars/", pillar_url[i], ".md")
    )
}
