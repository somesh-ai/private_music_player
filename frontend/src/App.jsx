import { useEffect, useMemo, useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import Playlist from "./components/Playlist.jsx";
import Player, { MiniPlayer } from "./components/Player.jsx";
import { useAudioPlayer } from "./hooks/useAudioPlayer.js";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}songs.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Manifest not found");
        return res.json();
      })
      .then(setSongs)
      .catch(() => setLoadError(true));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return songs;
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
    );
  }, [songs, query]);

  const player = useAudioPlayer(filtered);

  const handleSelect = (indexInFiltered) => {
    player.playSongAt(indexInFiltered);
    setMobileExpanded(true);
  };

  if (loadError) {
    return (
      <div className="h-full flex items-center justify-center bg-bg text-center px-6">
        <p className="font-ui text-sm text-muted max-w-sm">
          Couldn't load <code className="text-accent">songs.json</code>. Run the
          Python script in <code className="text-accent">scripts/</code> to
          generate it, then rebuild.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col md:flex-row bg-bg">
      <aside className="flex flex-col w-full md:w-[380px] md:border-r border-white/5 h-full md:h-screen">
        <div className="px-5 pt-6 pb-4">
          <h1 className="font-display text-xl text-text mb-4">Somesh Playlist</h1>
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <Playlist
          songs={filtered}
          currentIndex={player.currentIndex}
          isPlaying={player.isPlaying}
          onSelect={handleSelect}
        />
      </aside>

      <main className="flex-1 md:h-screen">
        <Player
          player={player}
          expanded={mobileExpanded}
          onCollapse={() => setMobileExpanded(false)}
        />
      </main>

      {!mobileExpanded && (
        <MiniPlayer player={player} onExpand={() => setMobileExpanded(true)} />
      )}
    </div>
  );
}
