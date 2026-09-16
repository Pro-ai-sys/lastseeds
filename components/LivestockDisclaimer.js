export default function LivestockDisclaimer({ categoryName }) {
  if (categoryName !== "Heritage Vee") return null;

  return (
    <div className="bg-amber-900/30 border border-amber-700 rounded-lg px-3 py-2 text-xs text-amber-200 mb-2">
      🐔 Deze dieren worden opgehaald bij de verkoper, geen verzending. Koper en
      verkoper zijn zelf verantwoordelijk voor eventuele vervoersdocumenten.
    </div>
  );
}
