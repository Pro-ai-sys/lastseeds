import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Header from "@/components/Header";

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        setStatus(ok ? "success" : "error");
        setMessage(data.message || data.error);
      })
      .catch(() => {
        setStatus("error");
        setMessage("Er ging iets mis");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-[#060a14] text-white">
      <Header showNav={false} />
      <div className="flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md bg-[#101828] border border-[#2a3a55] rounded-2xl p-8 text-center">
          {status === "loading" && (
            <p className="text-gray-400">Bezig met verifiëren...</p>
          )}

          {status === "success" && (
            <>
              <div className="text-4xl mb-4">✅</div>
              <h1 className="text-xl font-bold mb-2">E-mail bevestigd!</h1>
              <p className="text-gray-400 mb-6">{message}</p>
              <Link
                href="/login"
                className="bg-[#4a9eff] hover:bg-[#3a8eef] px-6 py-2 rounded-lg font-semibold transition inline-block"
              >
                Ga naar inloggen
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="text-4xl mb-4">⚠️</div>
              <h1 className="text-xl font-bold mb-2">Verificatie mislukt</h1>
              <p className="text-gray-400">{message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
