# javascript might be better!!!
# https://dev.to/jameswallis/combining-markdown-and-dynamic-routes-to-make-a-more-maintainable-next-js-website-3ogl

library(dplyr)
library(readr)
library(stringr)
library(foreach)
# library(googlesheets4)

# generateGoalsPages
getwd()
# go up one folder
# setwd("..")

data <- read_csv("src/.observablehq/cache/data/dfi.csv") %>%
    print()

goal <- data %>%
    distinct(goal) %>%
    arrange(goal) %>%
    pull()

goal_url <- goal %>%
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

storeLines <- readLines("src/goals/1goalPageTemplate.md")

foreach(i = 1:length(goal)) %do% {
    cleanLines <- storeLines %>%
        str_replace_all("gl", goal[i])

    goalLines <- cleanLines %>%
        # paste0(lapply(storeLines, FUN = function(x) breakFun(x)), collapse = "") %>%
        str_replace_all("gl", goal[i])

    write_lines(
        goalLines,
        paste0("src/goals/", goal_url[i], ".md")
    )
}
