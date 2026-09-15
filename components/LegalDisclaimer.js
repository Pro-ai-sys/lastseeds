export default function LegalDisclaimer({ categoryName }) {
  if (categoryName !== "Cannabis") return null;

  return (
    <div className="bg-amber-900/30 border border-amber-700 rounded-lg px-3 py-2 text-xs text-amber-200 mb-2">
      ⚠️ Wetgeving rond bezit, verkoop en teelt van cannabiszaden verschilt per
      land. Koper is zelf verantwoordelijk voor naleving van lokale wetgeving.
    </div>
  );
}
