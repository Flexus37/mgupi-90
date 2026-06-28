from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

workspace = Path(__file__).resolve().parents[2]
project = workspace / "mgupi-time-capsule"
output = workspace / "МГУПИ-90_сайт_и_отчет.zip"
excluded_dirs = {"node_modules", ".qa"}
excluded_files = {
    ".preview-error.log",
    ".preview-output.log",
    "Отчет_технологическая_практика_МГУПИ-90.docx",
    "Отчет_технологическая_практика_МГУПИ-90_ГОСТ.docx",
    "Отчет_технологическая_практика_МГУПИ-90_обновленный.docx",
    "Отчет_технологическая_практика_МГУПИ-90_финальный.docx",
}

with ZipFile(output, "w", compression=ZIP_DEFLATED, compresslevel=6) as archive:
    for path in sorted(project.rglob("*")):
        relative = path.relative_to(workspace)
        if any(part in excluded_dirs for part in relative.parts):
            continue
        if path.name.startswith("~$") or path.suffix == ".tsbuildinfo":
            continue
        if path.name in excluded_files:
            continue
        if path.is_file():
            archive.write(path, relative.as_posix())

print(output)
