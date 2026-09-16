export async function geocodePostalCode(postalCode, country) {
  if (!postalCode) return null;

  const query = country ? `${postalCode}, ${country}` : postalCode;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query
  )}&format=json&limit=1`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "LastSeeds/1.0 (contact@lastseeds.nl)" },
    });
    const data = await res.json();

    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }
  } catch (error) {
    console.error("Geocoding mislukt:", error);
  }

  return null;
}

// Haversine-formule: afstand tussen twee coördinaten in km
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // straal van de aarde in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
