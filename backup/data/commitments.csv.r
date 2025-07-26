library(dplyr)
library(readxl)
library(readr)

cp <- read_excel("data/commitments_pillars_goals.xlsx", sheet = 1) %>%
    select(commitment_num, pillar_txt:pillar_txt_short) %>%
    mutate(icon_url = paste0("https://raw.githubusercontent.com/cdtrich/dfi/refs/heads/main/icons/icon_", commitment_num, ".svg"))

cat(format_csv(cp))
write_csv(cp, "commitments.csv")

library(stringr)
cp %>%
    distinct(commitment_num, .keep_all = TRUE) %>%
    distinct(commitment_num, .keep_all = TRUE) %>%
    pull(commitment_txt)
