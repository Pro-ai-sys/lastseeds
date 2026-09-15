import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "@/components/Header";

export default function MotherPlantsPage() {
  const router = useRouter();
  const [motherPlants, setMotherPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [speciesId, setSpeciesId] = useState("");
  const [yearAcquired, setYearAcquired] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [mpRes, catRes] = await Promise.all([
      fetch("/api/motherplants"),
      fetch("/api/categories"),
    ]);
    if (mpRes.status === 401) {
      router.push("/login");
      return;
    }
    const mpData = await mpRes.json();
    const catData = await catRes.json();
    setMotherPlants(mpData.motherPlants || []);
    setCategories(catData.categories || []);
    setLoading(false);
  }

  async function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const data = await res.json();
    if (data.url) setPhotoUrl(data.url);
    setUploading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/motherplants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ speciesId, yearAcquired, description, photoUrl }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Er ging iets mis");
      return;
    }

    setSpeciesId("");
    setYearAcquired("");
    setDescription("");
    setPhotoUrl("");
    setCategoryId("");
    load();
  }

  async function handleDelete(id) {
    await fetch(`/api/motherplants?id=${id}`, { method: "DELETE" });
    load();
  }

  const selectedCategory = categories.find((c) => c.id === categoryId);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060a14] text-white flex items-center justify-center">
        Laden...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060a14] text-white">
      <Header />
      <div className="px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">Mijn moederplanten</h1>
            <Link
              href="/dashboard"
              className="text-[#4a9eff] hover:underline text-sm"
            >
              ← Terug naar dashboard
            </Link>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Toon in je winkel welke planten je al jarenlang bewaart en waar je
            elk jaar zaad van oogst.
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-[#101828] border border-[#2a3a55] rounded-2xl p-5 mb-8 space-y-3"
          >
            {error && (
              <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-2 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSpeciesId("");
                }}
                required
                className="bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white"
              >
                <option value="">Kies categorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={speciesId}
                onChange={(e) => setSpeciesId(e.target.value)}
                required
                disabled={!selectedCategory}
                className="bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white disabled:opacity-50"
              >
                <option value="">Kies soort</option>
                {selectedCategory?.species.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="number"
              value={yearAcquired}
              onChange={(e) => setYearAcquired(e.target.value)}
              placeholder="Sinds welk jaar heb je deze plant? Bijv. 2015"
              required
              className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Vertel iets over deze plant (optioneel)"
              rows={2}
              className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white"
            />

            <div>
              {photoUrl && (
                <img
                  src={photoUrl}
                  alt=""
                  className="w-24 h-24 object-cover rounded-lg mb-2"
                />
              )}
              <label className="inline-block bg-[#0a0e1a] border border-dashed border-[#2a3a55] rounded-lg px-4 py-2 text-sm text-gray-400 cursor-pointer hover:border-[#4a9eff]">
                {uploading
                  ? "Bezig met uploaden..."
                  : "Foto toevoegen (optioneel)"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              className="bg-[#4a9eff] hover:bg-[#3a8eef] px-4 py-2 rounded-lg font-semibold transition"
            >
              Toevoegen
            </button>
          </form>

          {motherPlants.length === 0 ? (
            <p className="text-gray-400">
              Je hebt nog geen moederplanten toegevoegd.
            </p>
          ) : (
            <div className="space-y-3">
              {motherPlants.map((mp) => (
                <div
                  key={mp.id}
                  className="bg-[#101828] border border-[#2a3a55] rounded-xl p-4 flex justify-between items-start"
                >
                  <div className="flex gap-3">
                    {mp.photoUrl && (
                      <img
                        src={mp.photoUrl}
                        alt=""
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{mp.species?.name}</p>
                      <p className="text-xs text-gray-500">
                        Sinds {mp.yearAcquired}
                      </p>
                      {mp.description && (
                        <p className="text-sm text-gray-300 mt-1">
                          {mp.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(mp.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Verwijderen
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
