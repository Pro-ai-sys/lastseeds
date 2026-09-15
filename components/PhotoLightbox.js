import { useState } from "react";

export default function PhotoLightbox({ photos }) {
  const [selected, setSelected] = useState(null);

  if (!photos || photos.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-4 gap-1 mb-3">
        {photos.map((photo, index) => (
          <img
            key={photo.id || index}
            src={photo.url || photo}
            alt=""
            onClick={() => setSelected(photo.url || photo)}
            className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
          />
        ))}
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 cursor-pointer p-4"
        >
          <img
            src={selected}
            alt=""
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}
    </>
  );
}
