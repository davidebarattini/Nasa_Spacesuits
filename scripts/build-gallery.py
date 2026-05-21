#!/usr/bin/env python3
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
IMAGES = ASSETS / "images"
VIDEOS = ASSETS / "videos"
OUT = ASSETS / "gallery.json"

PROGRAM_DIRS = ["Mercury", "Gemini", "Apollo", "SpaceShuttle"]
SECTIONS = ["Caratteristiche", "Materiali", "Missioni", "Astronauti"]
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"}
URL_EXTS = {".url", ".txt", ".list"}


def read_text(fp: Path) -> str:
  try:
    return fp.read_text(encoding="utf-8").strip()
  except Exception:
    try:
      return fp.read_text(encoding="latin-1").strip()
    except Exception:
      return ""


def youtube_id(url: str) -> str | None:
  # minimal robust parser without extra deps
  import re

  u = url.strip()
  m = re.search(r"youtu\.be/([A-Za-z0-9_-]{6,})", u)
  if m:
    return m.group(1)
  m = re.search(r"[?&]v=([A-Za-z0-9_-]{6,})", u)
  if m:
    return m.group(1)
  m = re.search(r"/embed/([A-Za-z0-9_-]{6,})", u)
  if m:
    return m.group(1)
  return None


def video_thumb(url: str) -> str | None:
  vid = youtube_id(url)
  if not vid:
    return None
  return f"https://img.youtube.com/vi/{vid}/hqdefault.jpg"


def rel_url(path: Path) -> str:
  rel = path.relative_to(ROOT).as_posix()
  return f"./{rel}"


def main() -> int:
  data = {}
  for program in PROGRAM_DIRS:
    pdir = IMAGES / program
    if not pdir.exists():
      continue
    program_obj = {}
    image_all = []
    for section in SECTIONS:
      sdir = pdir / section
      if not sdir.exists():
        continue
      files = []
      for fp in sorted(sdir.iterdir(), key=lambda x: x.name.lower()):
        if fp.is_file() and fp.suffix.lower() in EXTS:
          url = rel_url(fp)
          files.append(url)
          image_all.append(url)
      program_obj[section] = files

    # Pin images: assets/images/<Program>/Pin/<AnyFolderOrFiles>
    pin_dir = pdir / "Pin"
    pin_obj = {}
    if pin_dir.exists():
      for child in sorted(pin_dir.iterdir(), key=lambda x: x.name.lower()):
        if child.is_dir():
          files = []
          for fp in sorted(child.iterdir(), key=lambda x: x.name.lower()):
            if fp.is_file() and fp.suffix.lower() in EXTS:
              files.append(rel_url(fp))
          pin_obj[child.name] = files
        elif child.is_file() and child.suffix.lower() in EXTS:
          pin_obj.setdefault("_flat", []).append(rel_url(child))
    program_obj["Pin"] = pin_obj
    program_obj["ImageAll"] = image_all

    # Videos: assets/videos/<Program>/**.(url|txt|list) - shared for all sections
    vprog = VIDEOS / program
    items = []
    if vprog.exists():
      for fp in sorted(vprog.rglob("*"), key=lambda x: x.as_posix().lower()):
        if not fp.is_file() or fp.suffix.lower() not in URL_EXTS:
          continue
        raw = read_text(fp)
        if not raw:
          continue
        # Support both single-URL files and multi-line lists.
        urls = []
        for line in raw.splitlines():
          s = line.strip()
          if not s or s.startswith("#") or s.startswith("//"):
            continue
          if s.startswith("http"):
            urls.append(s)
        if not urls and raw.startswith("http"):
          urls = [raw.strip()]
        if not urls:
          continue

        base_title = fp.stem.replace("_", " ").strip()
        for i, url in enumerate(urls, start=1):
          title = base_title if len(urls) == 1 else f"{base_title} {i}"
          thumb = video_thumb(url)
          items.append({"title": title, "url": url, "thumb": thumb})
    program_obj["VideoAll"] = items

    data[program] = program_obj

  OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
  print(f"Wrote {OUT.relative_to(ROOT)}")
  return 0


if __name__ == "__main__":
  raise SystemExit(main())

