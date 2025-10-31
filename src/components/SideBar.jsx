function TopList({ top10 }) {
  if (!top10 || top10.length === 0) return <p>No quakes match the filter.</p>;
  return (
    <ol className="top-list" aria-label="Top 10 earthquakes">
      {top10.map((q) => (
        <li key={q.id}>
          <div className="top-item">
            <div className="top-mag">{q.properties?.mag?.toFixed(1)}</div>
            <div className="top-place">{q.properties?.place}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function Sidebar({
  minMag,
  setMinMag,
  onRefresh,
  loading,
  error,
  total,
  shown,
  top10,
}) {
  return (
    <div className="sidebar-inner">
      <section>
        <h2>Controls</h2>
        <label htmlFor="minMag">
          Min magnitude: <strong>{minMag}</strong>
        </label>
        <input
          id="minMag"
          type="range"
          min="0"
          max="8"
          step="0.1"
          value={minMag}
          onChange={(e) => setMinMag(Number(e.target.value))}
          aria-valuemin={0}
          aria-valuemax={8}
          aria-valuenow={minMag}
        />
        <div className="btn-row">
          <button
            onClick={onRefresh}
            disabled={loading}
            aria-disabled={loading}
          >
            Refresh
          </button>
        </div>

        <div className="stats">
          <div>Total fetched: {total}</div>
          <div>Shown: {shown}</div>
        </div>

        {error && (
          <div role="alert" className="error">
            {error}
          </div>
        )}
      </section>

      <section>
        <h3>Top 10 (by magnitude)</h3>
        <TopList top10={top10} />
      </section>

      <section>
        <h3>About</h3>
        <p className="about">
          This map displays earthquakes from the USGS all-day feed. Click
          markers to see details.
        </p>
      </section>
    </div>
  );
}
