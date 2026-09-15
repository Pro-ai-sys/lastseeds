import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '@/components/Header';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Er ging iets mis');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#060a14]">
      <Header showNav={false} />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-[#101828] border border-[#2a3a55] rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Nieuw wachtwoord</h1>

          {success ? (
            <>
              <p className="text-green-300 text-sm text-center mb-4">Je wachtwoord is gewijzigd!</p>
              <Link href="/login" className="block text-center bg-[#4a9eff] hover:bg-[#3a8eef] px-6 py-2 rounded-lg font-semibold transition">
                Ga naar inloggen
              </Link>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-2 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Nieuw wachtwoord</label>
                <input
                  type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-[#4a9eff] hover:bg-[#3a8eef] text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Bezig...' : 'Wachtwoord wijzigen'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}