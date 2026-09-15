const presets = {
    preset1: (
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="50" fill="#4a9eff" />
        <circle cx="50" cy="38" r="18" fill="#e8f2ff" />
        <path d="M20 90 Q50 60 80 90 Z" fill="#e8f2ff" />
      </svg>
    ),
    preset2: (
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="50" fill="#22c55e" />
        <circle cx="50" cy="38" r="18" fill="#eafff0" />
        <path d="M20 90 Q50 65 80 90 Z" fill="#eafff0" />
      </svg>
    ),
    preset3: (
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="50" fill="#f59e0b" />
        <circle cx="50" cy="38" r="18" fill="#fff7e8" />
        <path d="M20 90 Q50 65 80 90 Z" fill="#fff7e8" />
      </svg>
    ),
  };
  
  export default function Avatar({ type, url, size = 40 }) {
    if (type === 'custom' && url) {
      return (
        <img
          src={url}
          alt="Avatar"
          style={{ width: size, height: size }}
          className="rounded-full object-cover"
        />
      );
    }
  
    return (
      <div style={{ width: size, height: size }} className="rounded-full overflow-hidden">
        {presets[type] || presets.preset1}
      </div>
    );
  }