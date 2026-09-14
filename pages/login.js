import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Er ging iets mis');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Kan geen verbinding maken met de server');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060a14] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#101828] border border-[#2a3a55] rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Inloggen</h1>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-2 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">E-mail</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Wachtwoord</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4a9eff] hover:bg-[#3a8eef] text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Bezig...' : 'Inloggen'}
          </button>
        </form>

        <div className="flex justify-between text-sm mt-4">
          <Link href="/register" className="text-[#4a9eff] hover:underline">
            Account aanmaken
          </Link>
          <Link href="/forgot-password" className="text-[#4a9eff] hover:underline">
            Wachtwoord vergeten?
          </Link>
        </div>
      </div>
    </div>
  );
}