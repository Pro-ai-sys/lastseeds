import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '@/components/Header';
import Avatar from '@/components/Avatar';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState({ unreadMessages: 0, pendingTrades: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const [profileRes, notifRes] = await Promise.all([
      fetch('/api/profile'),
      fetch('/api/notifications'),
    ]);

    if (profileRes.status === 401) {
      router.push('/login');
      return;
    }

    const profileData = await profileRes.json();
    const notifData = await notifRes.json();

    setProfile(profileData.profile);
    setNotifications(notifData);
    setLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    const data = await res.json();
    if (data.url) {
      setProfile({ ...profile, avatarType: 'custom', avatarUrl: data.url });
    }
    setUploading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Er ging iets mis');
      setSaving(false);
      return;
    }

    setMessage('Profiel opgeslagen!');
    setSaving(false);
  }

  if (loading) {
    return <div className="min-h-screen bg-[#060a14] text-white flex items-center justify-center">Laden...</div>;
  }

  return (
    <div className="min-h-screen bg-[#060a14] text-white">
      <Header />
      <div className="px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Mijn profiel</h1>
            <Link href="/dashboard" className="text-[#4a9eff] hover:underline text-sm">← Terug naar dashboard</Link>
          </div>

          {/* Meldingen */}
          <div className="bg-[#101828] border border-[#2a3a55] rounded-2xl p-5 mb-6">
            <h2 className="font-bold mb-3">Meldingen</h2>
            <div className="flex gap-4">
              <Link href="/dashboard/messages" className="flex-1 bg-[#0a0e1a] rounded-lg p-3 text-center hover:border-[#4a9eff] border border-[#2a3a55] transition">
                <p className="text-2xl font-bold text-[#4a9eff]">{notifications.unreadMessages}</p>
                <p className="text-xs text-gray-400">Ongelezen berichten</p>
              </Link>
              <Link href="/dashboard/trades" className="flex-1 bg-[#0a0e1a] rounded-lg p-3 text-center hover:border-[#4a9eff] border border-[#2a3a55] transition">
                <p className="text-2xl font-bold text-[#4a9eff]">{notifications.pendingTrades}</p>
                <p className="text-xs text-gray-400">Openstaande ruilverzoeken</p>
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-2 text-sm">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-green-900/40 border border-green-700 text-green-300 rounded-lg px-4 py-2 text-sm">
                {message}
              </div>
            )}

            {/* Avatar */}
            <div className="bg-[#101828] border border-[#2a3a55] rounded-2xl p-5">
              <h2 className="font-bold mb-3">Profielfoto</h2>
              <div className="flex items-center gap-4 mb-4">
                <Avatar type={profile.avatarType} url={profile.avatarUrl} size={64} />
              </div>
              <div className="flex gap-3 mb-3">
                {['preset1', 'preset2', 'preset3'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setProfile({ ...profile, avatarType: type })}
                    className={`rounded-full ${profile.avatarType === type ? 'ring-2 ring-[#4a9eff]' : ''}`}
                  >
                    <Avatar type={type} size={48} />
                  </button>
                ))}
              </div>
              <label className="inline-block bg-[#0a0e1a] border border-dashed border-[#2a3a55] rounded-lg px-4 py-2 text-sm text-gray-400 cursor-pointer hover:border-[#4a9eff]">
                {uploading ? 'Bezig met uploaden...' : 'Eigen foto uploaden'}
                <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} className="hidden" />
              </label>
            </div>

            {/* Persoonlijke gegevens */}
            <div className="bg-[#101828] border border-[#2a3a55] rounded-2xl p-5 space-y-3">
              <h2 className="font-bold mb-1">Persoonlijke gegevens</h2>
              <p className="text-xs text-gray-500 mb-3">Alleen je gebruikersnaam is zichtbaar voor anderen.</p>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Gebruikersnaam</label>
                <input
                  type="text" name="username" value={profile.username || ''} onChange={handleChange}
                  className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Voornaam</label>
                  <input
                    type="text" name="firstName" value={profile.firstName || ''} onChange={handleChange}
                    className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Achternaam</label>
                  <input
                    type="text" name="lastName" value={profile.lastName || ''} onChange={handleChange}
                    className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Biografie</label>
                <textarea
                  name="bio" value={profile.bio || ''} onChange={handleChange} rows={3}
                  placeholder="Vertel iets over jezelf als zadenliefhebber..."
                  className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                />
              </div>
            </div>

            {/* Adresgegevens */}
            <div className="bg-[#101828] border border-[#2a3a55] rounded-2xl p-5 space-y-3">
              <h2 className="font-bold mb-1">Adresgegevens</h2>
              <p className="text-xs text-gray-500 mb-3">Voor verzend- en betaalopties. Nooit zichtbaar voor andere gebruikers.</p>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm text-gray-300 mb-1">Straat</label>
                  <input
                    type="text" name="street" value={profile.street || ''} onChange={handleChange}
                    className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Huisnr.</label>
                  <input
                    type="text" name="houseNumber" value={profile.houseNumber || ''} onChange={handleChange}
                    className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Toevoeging</label>
                  <input
                    type="text" name="houseNumberAddition" value={profile.houseNumberAddition || ''} onChange={handleChange}
                    className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Postcode</label>
                  <input
                    type="text" name="postalCode" value={profile.postalCode || ''} onChange={handleChange}
                    className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Woonplaats</label>
                  <input
                    type="text" name="city" value={profile.city || ''} onChange={handleChange}
                    className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit" disabled={saving}
              className="w-full bg-[#4a9eff] hover:bg-[#3a8eef] text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {saving ? 'Bezig met opslaan...' : 'Profiel opslaan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}