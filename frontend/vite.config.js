import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: replace 'my-music-site' with your actual GitHub repo name.
// If your repo is https://github.com/yourname/my-music-site, base stays as below.
// If you're deploying to a *user/org* page (yourname.github.io repo), set base to "/".
export default defineConfig({
  plugins: [react()],
base: "/private_music_player/",
});
