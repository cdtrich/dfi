# javascript might be better!!!
# https://dev.to/jameswallis/combining-markdown-and-dynamic-routes-to-make-a-more-maintainable-next-js-website-3ogl

library(dplyr)
library(readr)
library(stringr)
library(foreach)

# generateGoalsPages
# getwd()
# go up one folder
# setwd("..")

data <- read_csv("src/.observablehq/cache/data/goals.csv") %>%
    print()

goal <- data %>%
    distinct(goal_txt_short) %>%
    pull()

goal_num <- data %>%
    distinct(goal_num) %>%
    pull()

goal_url <- paste0("g", goal_num)

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
        str_replace_all("glnum", as.character(goal_num[i])) %>%
        str_replace_all("gltxt", goal[i])

    goalLines <- cleanLines %>%
        # paste0(lapply(storeLines, FUN = function(x) breakFun(x)), collapse = "") %>%
        str_replace_all("glnum", as.character(goal_num[i])) %>%
        str_replace_all("gltxt", goal[i])

    write_lines(
        goalLines,
        paste0("src/goals/", goal_url[i], ".md")
    )
}
