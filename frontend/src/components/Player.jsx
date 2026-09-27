function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Icon({ name }) {
  const common = "w-5 h-5 fill-current";
  switch (name) {
    case "play":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M8 5v14l11-7z" />
        </svg>
      );
    case "pause":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
        </svg>
      );
    case "next":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M6 5l10 7-10 7V5zM18 5h2v14h-2z" />
        </svg>
      );
    case "prev":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M18 5L8 12l10 7V5zM6 5h-2v14h2z" />
        </svg>
      );
    case "shuffle":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M17 3l4 4-4 4v-3h-2.6a2 2 0 00-1.6.8l-5.6 7.4a4 4 0 01-3.2 1.6H2v-2h2a2 2 0 001.6-.8l5.6-7.4a4 4 0 013.2-1.6H17V3zm0 18v-3h-2.6a4 4 0 01-3.2-1.6l-.7-.9 1.3-1.6.7.9a2 2 0 001.6.8H17v-3l4 4-4 4zM2 7h2a4 4 0 013.2 1.6l.7.9-1.3 1.6-.7-.9A2 2 0 004 10H2V7z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Player({ player, expanded, onCollapse }) {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffle,
    setShuffle,
    setVolume,
    togglePlay,
    playNext,
    playPrev,
    seek,
  } = player;

  if (!currentSong) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center text-muted font-ui text-sm gap-2 px-8 text-center">
        <span className="text-3xl">♪</span>
        Pick a song from your library to start listening.
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col ${
        expanded
          ? "fixed inset-0 z-20 bg-bg px-6 py-8 md:static md:p-10"
          : "hidden md:flex flex-1 px-10 py-10"
      }`}
    >
      {expanded && (
        <button
          onClick={onCollapse}
          className="md:hidden self-start mb-6 text-muted font-ui text-sm"
          aria-label="Close player"
        >
          ↓ minimize
        </button>
      )}

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div
          className="w-56 h-56 md:w-72 md:h-72 rounded-xl bg-surface2 mb-8 flex items-center justify-center overflow-hidden shrink-0"
          aria-hidden="true"
        >
          {currentSong.cover ? (
            <img
              src={import.meta.env.BASE_URL.replace(/\/$/, "") + currentSong.cover}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl text-muted">♪</span>
          )}
        </div>

        <h1 className="font-display text-2xl md:text-3xl text-text px-4 leading-snug">
          {currentSong.title}
        </h1>
        <p className="font-ui text-sm text-muted mt-2">{currentSong.artist}</p>
      </div>

      <div className="w-full max-w-xl mx-auto mt-8">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full"
          aria-label="Seek"
        />
        <div className="flex justify-between font-ui text-xs text-muted mt-1.5 tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            onClick={() => setShuffle(!shuffle)}
            aria-label="Toggle shuffle"
            aria-pressed={shuffle}
            className={`transition-colors ${shuffle ? "text-accent" : "text-muted hover:text-text"}`}
          >
            <Icon name="shuffle" />
          </button>
          <button onClick={playPrev} aria-label="Previous song" className="text-text hover:text-accent transition-colors">
            <Icon name="prev" />
          </button>
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="w-14 h-14 rounded-full bg-accent text-bg flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Icon name={isPlaying ? "pause" : "play"} />
          </button>
          <button onClick={playNext} aria-label="Next song" className="text-text hover:text-accent transition-colors">
            <Icon name="next" />
          </button>
          <div className="w-5" aria-hidden="true" />
        </div>

        <div className="hidden md:flex items-center gap-3 mt-8 max-w-[200px] mx-auto">
          <span className="font-ui text-xs text-muted">Vol</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}

export function MiniPlayer({ player, onExpand }) {
  const { currentSong, isPlaying, togglePlay, playNext } = player;
  if (!currentSong) return null;

  return (
    <button
      onClick={onExpand}
      className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-surface2 border-t border-white/5
                 px-4 py-3 flex items-center gap-3 text-left"
    >
      <div className="w-10 h-10 rounded-md bg-surface flex items-center justify-center overflow-hidden shrink-0">
        {currentSong.cover ? (
          <img
            src={import.meta.env.BASE_URL.replace(/\/$/, "") + currentSong.cover}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-muted">♪</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm text-text">{currentSong.title}</p>
        <p className="truncate font-ui text-xs text-muted">{currentSong.artist}</p>
      </div>
      <span
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
        role="button"
        aria-label={isPlaying ? "Pause" : "Play"}
        className="w-9 h-9 rounded-full bg-accent text-bg flex items-center justify-center shrink-0"
      >
        <Icon name={isPlaying ? "pause" : "play"} />
      </span>
      <span
        onClick={(e) => {
          e.stopPropagation();
          playNext();
        }}
        role="button"
        aria-label="Next song"
        className="text-text shrink-0"
      >
        <Icon name="next" />
      </span>
    </button>
  );
}
