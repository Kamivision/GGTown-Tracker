import json
from pathlib import Path

p = Path("townie_app/fixtures/townie_data.json")
rows = json.loads(p.read_text(encoding="utf-8"))

out = []
for i, row in enumerate(rows, start=1):
    fields = dict(row)

# Fix typo in incoming data
if "quest_amout" in fields:
    fields["quest_amount"] = fields.pop("quest_amout")

out.append({
"model": "townie_app.townie",
"pk": i,
"fields": fields
})
p.write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"Converted {len(out)} records")