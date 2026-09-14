import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const [usersRes, listingsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/listings'),
        fetch('/api/admin/categories'),
      ]);

      if (usersRes.status === 403) {
        setError('Geen toegang — je bent geen admin');
        setLoading(false);
        return;
      }

      setUsers((await usersRes.json()).users || []);
      setListings((await listingsRes.json()).listings || []);
      setCategories((await categoriesRes.json()).categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function changeRole(userId, role) {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    });
    loadAll();
  }

  async function deleteUser(userId) {
    if (!confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) return;
    await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    loadAll();
  }

  async function deleteListing(listingId) {
    if (!confirm('Weet je zeker dat je deze listing wilt verwijderen?')) return;
    await fetch('/api/admin/listings', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId }),
    });
    loadAll();
  }

  async function addCategory(e) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory }),
    });
    setNewCategory('');
    loadAll();
  }

  async function deleteCategory(categoryId) {
    if (!confirm('Weet je zeker dat je deze categorie wilt verwijderen?')) return;
    await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryId }),
    });
    loadAll();
  }

  if (loading) {
    return <div className="min-h-screen bg-[#060a14] text-white flex items-center justify-center">Laden...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#060a14] text-white flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060a14] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin-dashboard</h1>

        <div className="flex gap-2 mb-8 border-b border-[#2a3a55]">
          {['users', 'listings', 'categories'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 font-semibold ${tab === t ? 'text-[#4a9eff] border-b-2 border-[#4a9eff]' : 'text-gray-400'}`}
            >
              {t === 'users' ? 'Gebruikers' : t === 'listings' ? 'Listings' : 'Categorieën'}
            </button>
          ))}
        </div>

        {tab === 'users' && (
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.id} className="bg-[#101828] border border-[#2a3a55] rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{u.username} <span className="text-gray-400 text-sm">({u.email})</span></p>
                  <p className="text-xs text-gray-500">Rol: {u.role}</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className="bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="text-red-400 hover:text-red-300 text-sm px-3 py-1 border border-red-900 rounded-lg"
                  >
                    Verwijderen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'listings' && (
          <div className="space-y-3">
            {listings.map((l) => (
              <div key={l.id} className="bg-[#101828] border border-[#2a3a55] rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{l.title}</p>
                  <p className="text-xs text-gray-500">
                  {l.species?.category?.name} · {l.species?.name} · {l.owner?.username} · {l.listingType}
                  </p>
                </div>
                <button
                  onClick={() => deleteListing(l.id)}
                  className="text-red-400 hover:text-red-300 text-sm px-3 py-1 border border-red-900 rounded-lg"
                >
                  Verwijderen
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'categories' && (
          <div>
            <form onSubmit={addCategory} className="flex gap-2 mb-6">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nieuwe categorienaam"
                className="flex-1 bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white"
              />
              <button type="submit" className="bg-[#4a9eff] hover:bg-[#3a8eef] px-4 py-2 rounded-lg font-semibold">
                Toevoegen
              </button>
            </form>

            <div className="space-y-2">
              {categories.map((c) => (
                <div key={c.id} className="bg-[#101828] border border-[#2a3a55] rounded-xl p-3 flex justify-between items-center">
                  <span>{c.name}</span>
                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Verwijderen
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}