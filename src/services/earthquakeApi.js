const USGS_ALL_DAY = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

/**
 * Fetch earthquake GeoJSON from USGS
 * Returns parsed GeoJSON (features array, etc.)
 */
export async function fetchEarthquakes() {
  const res = await fetch(USGS_ALL_DAY, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch USGS feed: " + res.status);
  }
  const data = await res.json();
  return data;
}
