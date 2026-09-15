import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CategorySidebar({ categories }) {
  const router = useRouter();
  const [openCategories, setOpenCategories] = useState(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: true }), {})
  );

  function toggleCategory(categoryId) {
    setOpenCategories((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  }

  function goToSpecies(speciesId) {
    router.push(`/marketplace?species=${speciesId}`);
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-[#101828] border border-[#2a3a55] rounded-2xl p-4 h-fit sticky top-6">
      <h2 className="font-bold text-sm text-gray-400 mb-3 uppercase tracking-wide">Categorieën</h2>
      <div className="space-y-1">
        {categories.map((category) => (
          <div key={category.id}>
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex justify-between items-center px-2 py-2 rounded-lg hover:bg-[#0a0e1a] text-left font-semibold text-sm transition"
            >
              <span>{category.name}</span>
              <span className={`text-xs transition-transform ${openCategories[category.id] ? 'rotate-90' : ''}`}>
                ▶
              </span>
            </button>

            {openCategories[category.id] && (
              <div className="ml-2 border-l border-[#2a3a55] pl-3 mb-2">
                {category.species.map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => goToSpecies(sp.id)}
                    className="block w-full text-left px-2 py-1 rounded text-sm text-gray-400 hover:text-white hover:bg-[#0a0e1a] transition"
                  >
                    {sp.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}