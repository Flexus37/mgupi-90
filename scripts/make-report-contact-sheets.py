from pathlib import Path
import sys
from PIL import Image, ImageDraw

qa = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1] / ".qa" / "report"
pages = sorted(qa.glob("page-*.png"))
for batch_index in range(0, len(pages), 4):
    batch = pages[batch_index:batch_index + 4]
    sheet = Image.new("RGB", (1260, 1810), (214, 220, 224))
    draw = ImageDraw.Draw(sheet)
    for local_index, page_path in enumerate(batch):
        image = Image.open(page_path).convert("RGB")
        image.thumbnail((600, 850))
        x = 20 + (local_index % 2) * 620
        y = 35 + (local_index // 2) * 890
        draw.text((x, y - 22), page_path.stem, fill=(20, 30, 40))
        sheet.paste(image, (x, y))
    number = batch_index // 4 + 1
    sheet.save(qa / f"contact-{number:02d}.png")
print(f"Created {(len(pages) + 3) // 4} contact sheets for {len(pages)} pages")
