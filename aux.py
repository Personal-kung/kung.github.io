import json

# Files
INPUT_FILE = "data/information.json"
OUTPUT_FILE = "institutions_extracted.json"

LANGUAGES = ["en", "es", "ja", "zh"]

def make_id(name):
    """Create a simple ID from the English name."""
    return (
        name.lower()
            .replace("&", "and")
            .replace("/", "-")
            .replace(",", "")
            .replace(".", "")
            .replace("(", "")
            .replace(")", "")
            .replace("'", "")
            .replace("  ", " ")
            .strip()
            .replace(" ", "-")
    )

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

institutions = {}

for item in data:

    inst_field = item.get("institution")

    if not isinstance(inst_field, dict):
        continue

    # Use English as the reference language
    en_list = inst_field.get("en", "").split("<br>")

    # Split every language into corresponding lists
    lang_lists = {
        lang: inst_field.get(lang, "").split("<br>")
        for lang in LANGUAGES
    }

    for i, en_name in enumerate(en_list):
        en_name = en_name.strip()

        if not en_name:
            continue

        inst_id = make_id(en_name)

        if inst_id not in institutions:

            entry = {
                "id": inst_id,
                "name": {},
                "shortName": {},
                "type": {},
                "logo": None,
                "website": None,
                "location": None,
                "color": None,
                "description": {},
                "summary": {},
                "analogy": {},
                "active": True
            }

            for lang in LANGUAGES:
                names = lang_lists.get(lang, [])

                if i < len(names):
                    entry["name"][lang] = names[i].strip()
                else:
                    entry["name"][lang] = ""

                # Initialize shortName with full name
                entry["shortName"][lang] = entry["name"][lang]

                # Empty placeholders
                entry["type"][lang] = ""
                entry["description"][lang] = ""
                entry["summary"][lang] = ""
                entry["analogy"][lang] = ""

            institutions[inst_id] = entry

result = list(institutions.values())

result.sort(key=lambda x: x["name"]["en"])

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(result)} unique institutions.")
print(f"Saved to {OUTPUT_FILE}")