"""
generate_manifest.py

Scans a folder of MP3 files, reads their ID3 tags (title, artist, album,
duration, cover art), and writes a songs.json manifest that the React
frontend reads to build the playlist UI.

This script runs ONLY on your local machine. It is never deployed to
GitHub Pages and has nothing to do with the live website.

Usage:
    cd scripts
    python -m venv venv
    source venv/bin/activate        # on Windows: venv\\Scripts\\activate
    pip install -r requirements.txt
    python generate_manifest.py

Input:  ../public/songs/*.mp3
Output: ../public/songs.json
        ../public/covers/*.jpg   (extracted cover art, if present)
"""

import json
import os
from pathlib import Path

from mutagen.mp3 import MP3
from mutagen.id3 import ID3, APIC

# --- Config: adjust these paths if your folder layout differs ---
SONGS_DIR = Path(__file__).parent.parent / "public" / "songs"
COVERS_DIR = Path(__file__).parent.parent / "public" / "covers"
OUTPUT_JSON = Path(__file__).parent.parent / "public" / "songs.json"


def extract_cover_art(audio_path: Path, song_id: str) -> str | None:
    """Pull embedded cover art out of the MP3, save as jpg, return its
    public path (or None if the file has no embedded cover)."""
    try:
        tags = ID3(audio_path)
    except Exception:
        return None

    for tag in tags.values():
        if isinstance(tag, APIC):
            COVERS_DIR.mkdir(parents=True, exist_ok=True)
            cover_filename = f"{song_id}.jpg"
            cover_path = COVERS_DIR / cover_filename
            with open(cover_path, "wb") as f:
                f.write(tag.data)
            return f"/covers/{cover_filename}"
    return None


def build_manifest() -> list[dict]:
    if not SONGS_DIR.exists():
        raise FileNotFoundError(
            f"Songs folder not found: {SONGS_DIR}\n"
            f"Create it and put your mp3 files inside, then re-run this script."
        )

    songs = []
    mp3_files = sorted(SONGS_DIR.glob("*.mp3"))

    if not mp3_files:
        print(f"No mp3 files found in {SONGS_DIR}")
        return songs

    for i, path in enumerate(mp3_files, start=1):
        song_id = f"song_{i:03d}"

        try:
            audio = MP3(path)
            tags = audio.tags
        except Exception as e:
            print(f"  Skipping {path.name} (couldn't read tags: {e})")
            continue

        title = str(tags.get("TIT2", path.stem)) if tags else path.stem
        artist = str(tags.get("TPE1", "Unknown Artist")) if tags else "Unknown Artist"
        album = str(tags.get("TALB", "")) if tags else ""
        duration = round(audio.info.length) if audio.info else 0

        cover_path = extract_cover_art(path, song_id)

        songs.append({
            "id": song_id,
            "title": title,
            "artist": artist,
            "album": album,
            "duration": duration,
            "file": f"/songs/{path.name}",
            "cover": cover_path,
        })

        print(f"  Added: {artist} - {title}")

    return songs


def main():
    print(f"Scanning {SONGS_DIR} ...")
    songs = build_manifest()

    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(songs, f, indent=2, ensure_ascii=False)

    print(f"\nDone. {len(songs)} songs written to {OUTPUT_JSON}")


if __name__ == "__main__":
    main()