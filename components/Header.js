import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GoogleTranslate from "./GoogleTranslate";

export default function Header({ showNav = true }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .finally(() => setLoaded(true));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  }

  return (
    <div>
      {showNav && (
        <nav className="flex justify-between items-center px-6 py-4 border-b border-[#2a3a55] bg-[#060a14]">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold text-[#4a9eff]">
              LastSeeds
            </Link>
            <GoogleTranslate />
          </div>
          <div className="flex items-center gap-4">
            {loaded && user ? (
              <>
                <span className="text-sm text-gray-300">
                  Ingelogd als{" "}
                  <span className="text-white font-semibold">
                    {user.username}
                  </span>
                  {user.role === "admin" && (
                    <span className="ml-1 text-xs text-[#4a9eff]">(admin)</span>
                  )}
                </span>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="text-gray-300 hover:text-white"
                >
                  Profiel
                </Link>
                <Link
                  href="/dashboard/favorites"
                  className="text-gray-300 hover:text-white"
                >
                  Favorieten
                </Link>
                <Link
                  href="/dashboard/wanted"
                  className="text-gray-300 hover:text-white"
                >
                  Ik zoek
                </Link>
                <Link href="/wanted" className="text-gray-300 hover:text-white">
                  Zoeklijst
                </Link>
                <Link
                  href="/dashboard/messages"
                  className="text-gray-300 hover:text-white"
                >
                  Berichten
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="text-gray-300 hover:text-white"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white"
                >
                  Uitloggen
                </button>
              </>
            ) : loaded ? (
              <>
                <Link href="/login" className="text-gray-300 hover:text-white">
                  Inloggen
                </Link>
                <Link
                  href="/register"
                  className="bg-[#4a9eff] hover:bg-[#3a8eef] text-white px-4 py-2 rounded-lg transition"
                >
                  Registreren
                </Link>
              </>
            ) : null}
          </div>
        </nav>
      )}

      <svg
        viewBox="0 0 1200 160"
        className="w-full h-auto"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="bannerBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#060a14" />
            <stop offset="100%" stopColor="#101828" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4a9eff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4a9eff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="stemGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#2a3a55" />
            <stop offset="100%" stopColor="#4a9eff" />
          </linearGradient>
        </defs>

        <rect width="1200" height="160" fill="url(#bannerBg)" />
        <circle cx="600" cy="80" r="140" fill="url(#glow)" />

        {/* Drie zaadjes, waarvan de rechter ontkiemt */}
        <g transform="translate(85,55)">
          {/* Zaadje 1 (links, gewoon zaadje) */}
          <ellipse
            cx="0"
            cy="45"
            rx="9"
            ry="13"
            fill="none"
            stroke="#8896ab"
            strokeWidth="2.5"
            transform="rotate(-15 0 45)"
          />

          {/* Zaadje 2 (midden, gewoon zaadje) */}
          <ellipse
            cx="20"
            cy="50"
            rx="9"
            ry="13"
            fill="none"
            stroke="#8896ab"
            strokeWidth="2.5"
            transform="rotate(10 20 50)"
          />

          {/* Zaadje 3 (rechts) met ontkiemend steeltje en blaadjes */}
          <ellipse
            cx="42"
            cy="52"
            rx="9"
            ry="13"
            fill="none"
            stroke="#4a9eff"
            strokeWidth="2.5"
          />
          <path
            d="M42 39 C42 20, 42 12, 42 2"
            fill="none"
            stroke="url(#stemGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M42 22 C34 16, 28 18, 24 12 C30 10, 38 12, 42 18 Z"
            fill="#4a9eff"
            opacity="0.85"
          />
          <path
            d="M42 14 C50 8, 56 10, 60 4 C54 2, 46 4, 42 10 Z"
            fill="#4a9eff"
            opacity="0.85"
          />
        </g>

        <text
          x="180"
          y="75"
          fontFamily="sans-serif"
          fontSize="42"
          fontWeight="bold"
          fill="#ffffff"
        >
          LastSeeds
        </text>
        <text
          x="180"
          y="105"
          fontFamily="sans-serif"
          fontSize="16"
          fill="#8896ab"
        >
          Ongemanipuleerde biologische oerzaden
        </text>

        <g stroke="#2a3a55" strokeWidth="1">
          <line x1="700" y1="20" x2="700" y2="140" strokeDasharray="4 4" />
          <line x1="1100" y1="20" x2="1100" y2="140" strokeDasharray="4 4" />
        </g>
        <circle cx="900" cy="80" r="3" fill="#4a9eff" />
        <circle cx="950" cy="60" r="2" fill="#4a9eff" opacity="0.6" />
        <circle cx="1000" cy="100" r="2" fill="#4a9eff" opacity="0.6" />
      </svg>
    </div>
  );
}
