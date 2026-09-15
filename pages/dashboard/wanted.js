import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "@/components/Header";

export default function WantedPage() {
  const router = useRouter();
  const [wanted, setWanted] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [speciesId, setSpeciesId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [wantedRes, catRes] = await Promise.all([
      fetch("/api/wanted"),
      fetch("/api/categories"),
    ]);
    if (wantedRes.status === 401) {
      router.push("/login");
      return;
    }
    const wantedData = await wantedRes.json();
    const catData = await catRes.json();
    setWanted(wantedData.wanted || []);
    setCategories(catData.categories || []);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/wanted", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ speciesId, description }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Er ging iets mis");
      return;
    }

    setSpeciesId("");
    setDescription("");
    setCategoryId("");
    load();
  }

  async function handleDelete(id) {
    await fetch(`/api/wanted?id=${id}`, { method: "DELETE" });
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Ik zoek</h1>
            <Link
              href="/dashboard"
              className="text-[#4a9eff] hover:underline text-sm"
            >
              ← Terug naar dashboard
            </Link>
          </div>

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

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Bijv. 'Zoek zeldzame paarse variant, ruil mogelijk tegen tomatenzaad'"
              rows={2}
              className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white"
            />

            <button
              type="submit"
              className="bg-[#4a9eff] hover:bg-[#3a8eef] px-4 py-2 rounded-lg font-semibold transition"
            >
              Toevoegen aan mijn zoeklijst
            </button>
          </form>

          {wanted.length === 0 ? (
            <p className="text-gray-400">
              Je hebt nog niets op je zoeklijst staan.
            </p>
          ) : (
            <div className="space-y-2">
              {wanted.map((w) => (
                <div
                  key={w.id}
                  className="bg-[#101828] border border-[#2a3a55] rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{w.species?.name}</p>
                    <p className="text-xs text-gray-500">
                      {w.species?.category?.name}
                    </p>
                    {w.description && (
                      <p className="text-sm text-gray-300 mt-1">
                        {w.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(w.id)}
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
