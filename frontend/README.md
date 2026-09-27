# Archive — personal music player

A static site that plays your own downloaded MP3s, hosted free on GitHub Pages.

## 1. Add your songs

Drop your `.mp3` files into `public/songs/`.

## 2. Generate the manifest

```bash
cd scripts
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python generate_manifest.py
cd ..
```

This creates `public/songs.json` (and `public/covers/*.jpg` if your files have
embedded album art). Re-run it any time you add or remove songs.

## 3. Run locally

```bash
npm install
npm run dev
```

Open the printed localhost URL and confirm playback works.

## 4. Set your repo name

In `vite.config.js`, replace `my-music-site` in the `base` field with your
actual GitHub repo name (or `/` if this is a `yourname.github.io` user page).

## 5. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 6. Turn on GitHub Pages

In your repo: **Settings → Pages → Build and deployment → Source → GitHub
Actions**. The included workflow (`.github/workflows/deploy.yml`) builds and
deploys automatically on every push to `main`. Check the **Actions** tab for
progress; your site will be live at:

```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

## Notes

- Repo size: GitHub recommends keeping repos under ~1GB. If your library is
  large, compress to 128–192kbps mp3s, or move audio files to external
  storage (e.g. Cloudflare R2) and point `file` URLs in `songs.json` there
  instead of `/songs/...`.
- Re-run the Python script and push again whenever your library changes.
