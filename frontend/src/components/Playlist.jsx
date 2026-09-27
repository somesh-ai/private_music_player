function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Playlist({ songs, currentIndex, isPlaying, onSelect }) {
  if (songs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted font-ui text-sm px-6 text-center">
        No songs match. Try a different search, or check that songs.json lists your files.
      </div>
    );
  }

  return (
    <ul className="lib-scroll flex-1 overflow-y-auto px-2">
      {songs.map((song, i) => {
        const active = i === currentIndex;
        return (
          <li key={song.id}>
            <button
              onClick={() => onSelect(i)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                          transition-colors group
                          ${active ? "bg-surface2" : "hover:bg-surface2/60"}`}
            >
              <span
                className={`w-5 shrink-0 font-ui text-xs tabular-nums
                            ${active ? "text-accent" : "text-muted group-hover:text-text"}`}
              >
                {active && isPlaying ? "♪" : i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={`block truncate font-display text-[15px]
                              ${active ? "text-accent" : "text-text"}`}
                >
                  {song.title}
                </span>
                <span className="block truncate font-ui text-xs text-muted">
                  {song.artist}
                </span>
              </span>
              <span className="shrink-0 font-ui text-xs text-muted tabular-nums">
                {formatTime(song.duration)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
