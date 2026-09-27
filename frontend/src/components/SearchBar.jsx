export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Find a song or artist"
        aria-label="Search your library"
        className="w-full bg-surface2 text-text placeholder-muted font-ui text-sm
                   rounded-full pl-4 pr-4 py-2.5 border border-transparent
                   focus:border-accent/60 transition-colors"
      />
    </div>
  );
}
