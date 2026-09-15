import { useState } from "react";
import { useRouter } from "next/router";

export default function ReportButton({ targetType, targetId }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("spam");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId, reason, description }),
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Er ging iets mis");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-xs text-green-400">
        Bedankt, je melding is verstuurd.
      </p>
    );
  }

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-xs text-gray-500 hover:text-red-400 underline"
        >
          Rapporteer
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-[#0a0e1a] border border-[#2a3a55] rounded-lg p-3 mt-2 space-y-2"
        >
          {error && <p className="text-xs text-red-400">{error}</p>}
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-[#101828] border border-[#2a3a55] rounded px-2 py-1 text-xs text-white"
          >
            <option value="spam">Spam</option>
            <option value="misleidend">Misleidende informatie</option>
            <option value="illegaal">Illegale content</option>
            <option value="ongepast">Ongepast gedrag</option>
            <option value="anders">Anders</option>
          </select>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optionele toelichting"
            rows={2}
            className="w-full bg-[#101828] border border-[#2a3a55] rounded px-2 py-1 text-xs text-white"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="text-xs bg-red-900 hover:bg-red-800 px-3 py-1 rounded"
            >
              Versturen
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-gray-500"
            >
              Annuleren
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
