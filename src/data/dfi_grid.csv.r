library(dplyr)
library(tidyr)
library(readr)
library(stringr)

# data <- read_csv("C:/Users/dietr/Downloads/dfi.csv") %>%
data <- read_csv("dfi.csv") %>%
    as.data.frame()

grid <- data %>%
    mutate(pillar_num = str_sub(pillar, str_length(pillar) - 1, str_length(pillar)) %>% as.numeric()) %>%
    mutate(goal_num = str_sub(goal, str_length(goal) - 1, str_length(goal)) %>% as.numeric()) %>%
    select(
        NAME_ENGL,
        commitment_txt,
        commitment_num,
        pillar,
        pillar_num,
        goal,
        goal_num,
        value,
        country_url
    ) %>%
    group_by(NAME_ENGL, pillar) %>%
    mutate(avg_pillar = mean(value, na.rm = TRUE)) %>%
    group_by(NAME_ENGL, goal) %>%
    mutate(avg_goal = mean(value, na.rm = TRUE)) %>%
    ungroup() %>%
    mutate(x = commitment_num) %>%
    pivot_longer(c(goal_num, pillar_num, commitment_num), values_to = "namevalues") %>%
    select(-namevalues) %>%
    # filter(NAME_ENGL == "Afghanistan") %>%
    # arrange(name) %>%
    # as.data.frame() %>%
    # count(value) %>%
    # print()
    mutate(val = case_when(
        str_detect(name, "goal") ~ avg_goal,
        str_detect(name, "pillar") ~ avg_pillar,
        str_detect(name, "mmitmen") ~ value
    )) %>%
    mutate(y = case_when(
        str_detect(name, "goal") ~ 3,
        str_detect(name, "pillar") ~ 2,
        str_detect(name, "mmitmen") ~ 1
    )) %>%
    select(
        NAME_ENGL,
        goal,
        pillar,
        commitment_txt,
        x,
        y,
        avg_goal,
        avg_pillar,
        value,
        name
    )

grid_ed <- grid %>%
    filter(name == "goal_num") %>%
    # distinct(NAME_ENGL, goal, .keep_all = TRUE) %>%
    mutate(name = "Goal") %>%
    select(NAME_ENGL, name, val = avg_goal, x, y) %>%
    bind_rows(
        grid %>%
            filter(name == "pillar_num") %>%
            # distinct(NAME_ENGL, pillar, .keep_all = TRUE) %>%
            mutate(name = "Pillar") %>%
            select(NAME_ENGL, name, val = avg_pillar, x, y)
    ) %>%
    bind_rows(
        grid %>%
            filter(name == "commitment_num") %>%
            # distinct(NAME_ENGL, .keep_all = TRUE) %>%
            mutate(name = "Commitment") %>%
            select(NAME_ENGL, name, val = value, x, y)
    )
# group_by(NAME_ENGL, name) %>%
# print()
# mutate(x = row_number())
# print()

# grid_ed %>%
#     filter(NAME_ENGL == "Afghanistan") %>%
#     count(x)
#     as.data.frame()
# filter(name == "commitment_num") %>% head() %>% as.data.frame()

cat(format_csv(grid_ed))
write_csv(grid_ed, "dfi_grid.csv")
