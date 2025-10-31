import { useEffect, useMemo, useState } from "react";
import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";
import { fetchEarthquakes } from "./services/earthquakeApi";

export default function App() {
  const [quakes, setQuakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minMag, setMinMag] = useState(0);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEarthquakes();
      setQuakes(data.features || []);
    } catch (err) {
      setError("Failed to load earthquake data. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // auto-refresh every 5 minutes
    const id = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(
    () => quakes.filter((q) => (q.properties?.mag ?? 0) >= minMag),
    [quakes, minMag]
  );

  const top10 = useMemo(
    () =>
      [...filtered]
        .sort((a, b) => (b.properties?.mag ?? 0) - (a.properties?.mag ?? 0))
        .slice(0, 10),
    [filtered]
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Earthquake Visualizer</h1>
        <p className="subtitle">
          Live USGS feed · interactive map · magnitude-scaled markers
        </p>
      </header>

      <main className="main">
        <aside className="sidebar" aria-label="Controls">
          <Sidebar
            minMag={minMag}
            setMinMag={setMinMag}
            onRefresh={load}
            loading={loading}
            error={error}
            total={quakes.length}
            shown={filtered.length}
            top10={top10}
          />
        </aside>

        <section className="map-section" aria-label="Map">
          <MapView quakes={filtered} loading={loading} />
        </section>
      </main>

      <footer className="footer">
        <small>
          Data: USGS Earthquake Hazards Program —{" "}
          <a
            href="https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php"
            target="_blank"
            rel="noreferrer"
          >
            GeoJSON feeds
          </a>
        </small>
      </footer>
    </div>
  );
}
