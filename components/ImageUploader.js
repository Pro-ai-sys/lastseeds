import { useState } from "react";

export default function ImageUploader({ photos, setPhotos }) {
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e) {
    const files = Array.from(e.target.files).slice(0, 4 - photos.length);
    if (files.length === 0) return;

    setUploading(true);

    for (const file of files) {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const data = await res.json();
      if (data.url) {
        setPhotos((prev) => [...prev, data.url]);
      }
    }

    setUploading(false);
  }

  function removePhoto(index) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">
        Foto&apos;s ({photos.length}/4)
      </label>

      <div className="grid grid-cols-4 gap-2 mb-2">
        {photos.map((url, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute top-1 right-1 bg-red-900 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {photos.length < 4 && (
        <label className="block bg-[#0a0e1a] border border-dashed border-[#2a3a55] rounded-lg p-4 text-center text-sm text-gray-400 cursor-pointer hover:border-[#4a9eff]">
          {uploading ? "Bezig met uploaden..." : "+ Foto toevoegen"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
