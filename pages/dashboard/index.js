import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', quantity: 1, isHeirloom: true,
    listingType: 'sale', price: '', categoryId: '', speciesId: '',
    originCountry: '', plantingMonth: '', startPrice: '', auctionDays: 7,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [listingsRes, categoriesRes] = await Promise.all([
        fetch('/api/listings'),
        fetch('/api/categories'),
      ]);

      if (listingsRes.status === 401) {
        router.push('/login');
        return;
      }

      const listingsData = await listingsRes.json();
      const categoriesData = await categoriesRes.json();

      setListings(listingsData.listings || []);
      setCategories(categoriesData.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'categoryId') {
      setForm({ ...form, categoryId: value, speciesId: '' });
    } else {
      setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Er ging iets mis');
      return;
    }

    setForm({
      title: '', description: '', quantity: 1, isHeirloom: true,
      listingType: 'sale', price: '', categoryId: '', speciesId: '',
      originCountry: '', plantingMonth: '', startPrice: '', auctionDays: 7,
    });
    setShowForm(false);
    loadData();
  };

  const selectedCategory = categories.find((c) => c.id === form.categoryId);
  const maanden = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

  if (loading) {
    return <div className="min-h-screen bg-[#060a14] text-white flex items-center justify-center">Laden...</div>;
  }

  return (
    <div className="min-h-screen bg-[#060a14] text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Mijn zaden</h1>
            <Link href="/dashboard/trades" className="text-sm text-[#4a9eff] hover:underline">
              Bekijk ruilverzoeken →
            </Link>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#4a9eff] hover:bg-[#3a8eef] px-4 py-2 rounded-lg font-semibold transition"
          >
            {showForm ? 'Annuleren' : '+ Nieuwe listing'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-[#101828] border border-[#2a3a55] rounded-2xl p-6 mb-8 space-y-4">
            {error && (
              <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-lg px-4 py-2 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-300 mb-1">Titel</label>
              <input
                type="text" name="title" required value={form.title} onChange={handleChange}
                className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Beschrijving</label>
              <textarea
                name="description" value={form.description} onChange={handleChange} rows={3}
                className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Categorie</label>
                <select
                  name="categoryId" required value={form.categoryId} onChange={handleChange}
                  className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                >
                  <option value="">Kies categorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Soort</label>
                <select
                  name="speciesId" required value={form.speciesId} onChange={handleChange}
                  disabled={!selectedCategory}
                  className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff] disabled:opacity-50"
                >
                  <option value="">Kies soort</option>
                  {selectedCategory?.species.map((sp) => (
                    <option key={sp.id} value={sp.id}>{sp.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Land van herkomst</label>
                <input
                  type="text" name="originCountry" value={form.originCountry} onChange={handleChange}
                  placeholder="Bijv. Nederland"
                  className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Plantmaand</label>
                <select
                  name="plantingMonth" value={form.plantingMonth} onChange={handleChange}
                  className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                >
                  <option value="">Kies maand</option>
                  {maanden.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Type</label>
                <select
                  name="listingType" value={form.listingType} onChange={handleChange}
                  className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                >
                  <option value="sale">Verkopen</option>
                  <option value="auction">Veilen</option>
                  <option value="trade">Ruilen</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Aantal</label>
                <input
                  type="number" name="quantity" min="1" value={form.quantity} onChange={handleChange}
                  className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                />
              </div>
            </div>

            {form.listingType === 'sale' && (
              <div>
                <label className="block text-sm text-gray-300 mb-1">Prijs</label>
                <input
                  type="number" step="0.01" name="price" value={form.price} onChange={handleChange}
                  className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                />
              </div>
            )}

            {form.listingType === 'auction' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Startprijs (€)</label>
                  <input
                    type="number" step="0.01" name="startPrice" value={form.startPrice} onChange={handleChange}
                    className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Looptijd (dagen)</label>
                  <input
                    type="number" min="1" name="auctionDays" value={form.auctionDays} onChange={handleChange}
                    className="w-full bg-[#0a0e1a] border border-[#2a3a55] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#4a9eff]"
                  />
                </div>
              </div>
            )}

            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" name="isHeirloom" checked={form.isHeirloom} onChange={handleChange} />
              Dit zijn ongemanipuleerde (heirloom) zaden
            </label>

            <button
              type="submit"
              className="bg-[#4a9eff] hover:bg-[#3a8eef] px-4 py-2 rounded-lg font-semibold transition"
            >
              Plaatsen
            </button>
          </form>
        )}

        {listings.length === 0 ? (
          <p className="text-gray-400">Je hebt nog geen listings geplaatst.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-[#101828] border border-[#2a3a55] rounded-2xl p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{listing.title}</h3>
                  {listing.isHeirloom && (
                    <span className="text-xs bg-green-900/40 text-green-300 px-2 py-1 rounded-full">🌱 Heirloom</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-3">{listing.description}</p>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>{listing.species?.category?.name} · {listing.species?.name}</p>
                  {listing.originCountry && <p>Herkomst: {listing.originCountry}</p>}
                  {listing.plantingMonth && <p>Planten: {listing.plantingMonth}</p>}
                  <p className="capitalize">{listing.listingType === 'sale' ? 'Verkoop' : listing.listingType === 'auction' ? 'Veiling' : 'Ruil'}</p>
                </div>
                {listing.price && <p className="text-[#4a9eff] font-semibold mt-2">€{listing.price}</p>}
                {listing.listingType === 'auction' && listing.auction && (
                  <p className="text-[#4a9eff] font-semibold mt-2">Startprijs: €{listing.auction.startPrice}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}