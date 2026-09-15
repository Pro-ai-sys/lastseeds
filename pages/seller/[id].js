import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Link from "next/link";

export default function SellerProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadReviews();
  }, [id]);

  async function loadReviews() {
    const res = await fetch(`/api/reviews/${id}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch(`/api/reviews/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });

    const json = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      setError(json.error || "Er ging iets mis");
      return;
    }

    setSuccess("Bedankt voor je review!");
    setComment("");
    loadReviews();
  }

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
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Verkopersprofiel</h1>
          <div className="flex gap-2">
            <Link
              href={`/shop/${id}`}
              className="border border-[#2a3a55] hover:border-[#4a9eff] px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Bekijk winkel
            </Link>
            <Link
              href={`/dashboard/messages/${id}`}
              className="bg-[#4a9eff] hover:bg-[#3a8eef] px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Stuur bericht
            </Link>
          </div>
        </div>

        <div className="bg-[#101828] border border-[#2a3a55] rounded-2xl p-6 mb-8">
          {data.badge && (
            <span className="inline-block bg-[#4a9eff]/20 text-[#4a9eff] text-xs font-semibold px-3 py-1 rounded-full mb-3">
              🏆 {data.badge}
            </span>
          )}
          {data.memberSince && (
            <p className="text-xs text-gray-500 mb-3">
              Lid sinds{" "}
              {new Date(data.memberSince).toLocaleDateString("nl-NL", {
                year: "numeric",
                month: "long",
              })}
            </p>
          )}
          {data.avgRating ? (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-bold text-[#4a9eff]">
                {data.avgRating}
              </span>
              <span className="text-yellow-400">
                {"★".repeat(Math.round(data.avgRating))}
              </span>
              <span className="text-gray-400 text-sm">
                ({data.count} reviews)
              </span>
            </div>
          ) : (
            <p className="text-gray-400">Nog geen reviews.</p>
          )}
        </div>

        <div className="bg-[#101828] border border-[#2a3a55] rounded-2xl p-6 mb-8">
          <h2 className="font-bold mb-3">Laat een review achter</h2>
          {error && (
            <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-2 text-sm mb-3">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-900/40 border border-green-700 text-green-300 rounded-lg px-4 py-2 text-sm mb-3">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} ster{n > 1 ? "ren" : ""}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Je ervaring met deze verkoper (optioneel)"
              className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white"
            />
            <button
              type="submit"
              className="bg-[#4a9eff] hover:bg-[#3a8eef] px-6 py-2 rounded-lg font-semibold transition"
            >
              Review plaatsen
            </button>
          </form>
        </div>

        <div>
          <h2 className="font-bold mb-3">Reviews</h2>
          {data.reviews.length === 0 ? (
            <p className="text-gray-500 text-sm">Nog geen reviews.</p>
          ) : (
            <div className="space-y-3">
              {data.reviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-[#101828] border border-[#2a3a55] rounded-xl p-4"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">
                      {r.reviewer?.username}
                    </span>
                    <span className="text-yellow-400">
                      {"★".repeat(r.rating)}
                    </span>
                  </div>
                  {r.comment && (
                    <p className="text-gray-300 text-sm">{r.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
