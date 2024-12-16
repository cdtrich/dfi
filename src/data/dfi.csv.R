library(dplyr)
library(purrr)
library(readr)
library(readxl)
library(googlesheets4)
library(stringr)

# READ ALL DATA FILES ---------------------------------------------------------

# List all files in the directory
file_list <- list.files(path = "data", pattern = "\\.xlsx$", full.names = TRUE)

# Filter files with the specific pattern (e.g., "X-Y.xlsx" or "X-YY.xlsx")
filtered_files <- file_list[grepl("^data/[0-9]-[0-9]{1,2}\\.xlsx$", file_list)]

# ONLY THOSE CURRENTLY WORKING
# filtered_files <- filtered_files[c(1:17, 19:23)]
filtered_files <- filtered_files[c(1:17, 19:23)]

# Function to process each file
process_file <- function(file_path) {
    # Read the file
    df <- read_excel(file_path)

    # Harmonize column names (replace variations of 'max' with 'max')
    colnames(df) <- gsub("^max( \\(.*\\))?$", "max", colnames(df))

    # Extract the first and last character of the file name
    file_name <- tools::file_path_sans_ext(basename(file_path))
    pillar <- strsplit(file_name, "-")[[1]][1]
    commitent <- strsplit(file_name, "-")[[1]][2]

    # Filter the data frame
    df %>%
        # falsely coded pillars
        mutate(pillar = ifelse(str_length(pillar) > 1,
            as.numeric(str_sub(pillar, str_length(pillar), str_length(pillar))),
            pillar
        )) %>%
        # values that are characters
        mutate(value = as.numeric(value)) %>%
        # data year as characters (just to be sure)
        mutate(`Data year` = as.character(`Data year`)) %>%
        # filter only to current column of commitment b/c of problem with 1-1.xlsx
        filter(pillar == pillar, commitment_num == commitent)
}

# Apply the function to each file and combine into a single tibble
dfi <- filtered_files %>%
    map_dfr(process_file)

# View the combined data
# print(dfi)

# JOIN WITH COMMITMENT-PILLAR-GOAL FILE ---------------------------------------

# this shows which pillars commitments belong to
cp <- read_excel("data/commitments_pillars_goals.xlsx", sheet = 1) %>%
    select(commitment_num, pillar_txt:pillar_txt_short)

# this shows all relationships from commitments to both pillars and goals
cpg <- read_excel("data/commitments_pillars_goals.xlsx", sheet = 2) %>%
    select(commitment_num, pillar_txt:goal_txt_short)

dfi_pillars <- dfi %>%
    rename(pillar_num = pillar) %>%
    # only unique commitments
    left_join(cp,
        by = "commitment_num"
    )

# CLEAN COUNTRY NAMES ---------------------------------------

# replacement characters
replacements <- c("é" = "e", "ê" = "e", "à" = "a")

dfi_rename <- dfi_pillars %>%
    # rename var names
    rename(
        source = `source (url)`,
        year = `Data year`
    ) %>%
    select(NAME_ENGL:year, pillar_txt, pillar_txt_short)

dfi_clean <- dfi_rename %>%
    # drop all missing values
    filter(!is.na(value)) %>%
    # sanitize country name
    mutate(countryClean = str_remove_all(NAME_ENGL, "[^[:alnum:]]")) %>%
    mutate(countryClean = str_remove_all(NAME_ENGL, ",")) %>%
    mutate(countryClean = str_replace_all(NAME_ENGL, replacements)) %>%
    mutate(countryClean = iconv(countryClean, from = "UTF-8", to = "ASCII//TRANSLIT")) %>%
    # generate urls
    mutate(country_url = paste0("./countries/", str_remove_all(countryClean, " "))) %>%
    mutate(pillar_url = paste0("./pillars/", "pillar", pillar_num)) %>%
    mutate(icon_url = paste0("https://raw.githubusercontent.com/cdtrich/dfi/refs/heads/main/icons/icon_", commitment_num, ".svg")) %>%
    # mutate(goal_url = paste0("./goals/", str_remove_all(goal, " "))) %>%
    # mutate(icon_url = paste0("https://raw.githubusercontent.com/cdtrich/dfi/31dd713cd80fedd810e802e95bc4e0c84cae88e3/icons/icon_", commitment_num, ".svg")) %>%
    dplyr::select(-countryClean) %>%
    # normalize
    group_by(commitment_txt) %>%
    mutate(
        value = 100 * (value - min) / (max - min),
        value = ifelse(min > max, 100 - value, value)
    ) %>%
    ungroup() %>%
    # Adding a sequential count for commitments within each pillar
    group_by(pillar_num, commitment_num) %>%
    mutate(row_id = row_number()) %>% # Count rows within pillar-commitment pairs
    ungroup() %>%
    group_by(pillar_num) %>%
    mutate(x = cumsum(!duplicated(commitment_num))) %>%
    ungroup() %>%
    # adding some jitter to y for integer values
    mutate(y = jitter(value, amount = 2)) %>%
    # slice(1:5) %>%
    # head() %>%
    # as.data.frame() %>%
    # print()
    # arrange alphabetically
    arrange(NAME_ENGL)

# cat(format_csv(commitments_ed))
# write_csv(commitments_ed, "commitments.csv")

cat(format_csv(dfi_clean))
write_csv(dfi_clean, "dfi.csv")
