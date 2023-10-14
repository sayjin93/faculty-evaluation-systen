# 14 April 2023 (JK) - This script will sorts the keys of each dictionary in alphabetical order and updating them with the missing keys from en.json.

import os
import json

# Get the script's directory and set the target directory to 'public/locales'
script_dir = os.path.dirname(os.path.abspath(__file__))
# locales_dir = os.path.join(script_dir, '..')
locales_dir = script_dir


# Load the contents of en.json into the 'en_data' variable
with open(os.path.join(locales_dir, "en.json"), "r", encoding="utf-8") as en_file:
    en_data = json.load(en_file)

# Get the keys from the 'en.json' file
en_keys = set(en_data.keys())

# Loop through all files in the script directory
for filename in os.listdir(locales_dir):
    if filename.endswith(".json"):
        file_path = os.path.join(locales_dir, filename)

        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)

        # Get the keys from the current JSON file
        current_keys = set(data.keys())

        # Find the difference between the 'en_keys' and 'current_keys' sets
        missing_keys = en_keys - current_keys

        # Loop through the missing keys and add them to the current JSON file
        for key in missing_keys:
            # If the key exists in en_data, add it to the current JSON file with the value followed by " (EN)"
            if key in en_data:
                data[key] = f"{en_data[key]} (EN)"

        # Sort the dictionary by keys before writing it back to disk
        sorted_data = {key: data[key] for key in sorted(data.keys())}

        with open(file_path, 'w', encoding="utf-8") as file:
            json.dump(sorted_data, file, ensure_ascii=False, indent=2)