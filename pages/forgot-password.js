import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#060a14]">
      <Header showNav={false} />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-[#101828] border border-[#2a3a55] rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Wachtwoord vergeten</h1>

          {message ? (
            <p className="text-green-300 text-sm text-center mb-4">{message}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">E-mail</label>
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-[#4a9eff] hover:bg-[#3a8eef] text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Bezig...' : 'Reset-link versturen'}
              </button>
            </form>
          )}

          <p className="text-gray-400 text-sm text-center mt-4">
            <Link href="/login" className="text-[#4a9eff] hover:underline">Terug naar inloggen</Link>
          </p>
        </div>
      </div>
    </div>
  );
}