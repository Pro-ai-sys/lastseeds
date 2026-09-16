import { useState } from "react";
import { useRouter } from "next/router";

export default function ContactSellerButton({
  sellerId,
  listingTitle,
  buttonText = "Neem contact op",
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(
    `Hallo, ik ben geïnteresseerd in "${listingTitle}". `
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSending(true);

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: sellerId, content: message }),
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Er ging iets mis");
      setSending(false);
      return;
    }

    setSent(true);
    setSending(false);
  }

  if (sent) {
    return (
      <div className="bg-green-900/40 border border-green-700 text-green-300 rounded-lg px-4 py-2 text-sm mt-3">
        Bericht verstuurd! Check je berichten voor het antwoord.
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="block w-full mt-3 text-center bg-[#4a9eff] hover:bg-[#3a8eef] py-2 rounded-lg text-sm font-semibold transition"
      >
        {buttonText}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      {error && (
        <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-3 py-2 text-xs">
          {error}
        </div>
      )}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#4a9eff]"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={sending}
          className="flex-1 bg-[#4a9eff] hover:bg-[#3a8eef] py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
        >
          {sending ? "Versturen..." : "Verstuur bericht"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-3 text-sm text-gray-400 hover:text-white"
        >
          Annuleren
        </button>
      </div>
    </form>
  );
}
