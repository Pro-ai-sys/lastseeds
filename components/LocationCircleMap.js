import { useEffect, useRef } from "react";

export default function LocationCircleMap({ latitude, longitude, city }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!latitude || !longitude || !mapRef.current) return;

    // Dynamisch laden, want Leaflet werkt niet met server-side rendering
    import("leaflet").then((L) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapRef.current, {
        center: [latitude, longitude],
        zoom: 9,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      // Cirkel van 25 km, GEEN exacte pin
      L.circle([latitude, longitude], {
        radius: 25000, // in meters
        color: "#4a9eff",
        fillColor: "#4a9eff",
        fillOpacity: 0.15,
      }).addTo(map);

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude]);

  if (!latitude || !longitude) return null;

  return (
    <div>
      <p className="text-xs text-gray-500 mb-2">
        Actief in de regio {city} (± 25 km)
      </p>
      <div
        ref={mapRef}
        style={{ height: "200px", borderRadius: "12px", overflow: "hidden" }}
        className="border border-[#2a3a55]"
      />
    </div>
  );
}
