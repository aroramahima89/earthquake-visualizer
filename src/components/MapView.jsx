import React from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "react-leaflet-markercluster/styles";

function FitBounds({ quakes }) {
  const map = useMap();
  React.useEffect(() => {
    if (!map || !quakes || quakes.length === 0) return;
    const latlngs = quakes
      .map((q) => {
        const coords = q.geometry?.coordinates;
        if (!coords) return null;
        return [coords[1], coords[0]];
      })
      .filter(Boolean);
    if (latlngs.length === 0) return;
    map.fitBounds(latlngs, { maxZoom: 6, padding: [40, 40] });
  }, [map, quakes]);
  return null;
}

function colorForMag(mag) {
  if (mag >= 6) return "#b10026";
  if (mag >= 5) return "#e31a1c";
  if (mag >= 4) return "#fc4e2a";
  if (mag >= 3) return "#fd8d3c";
  if (mag >= 2) return "#feb24c";
  return "#fed976";
}

export default function MapView({ quakes = [], loading }) {
  const center = [20, 0]; // global view

  return (
    <div className="map-wrapper" role="application" aria-busy={loading}>
      <MapContainer
        center={center}
        zoom={2}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">Carto</a> & contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MarkerClusterGroup chunkedLoading>
          {quakes.map((q) => {
            const coords = q.geometry?.coordinates;
            if (!coords) return null;
            const lon = coords[0];
            const lat = coords[1];
            const mag = q.properties?.mag ?? 0;
            const place = q.properties?.place ?? "Unknown location";
            const time = q.properties?.time
              ? new Date(q.properties.time).toLocaleString()
              : "Unknown time";

            const radius = Math.max(4, mag * 4 + 2);

            return (
              <CircleMarker
                key={q.id}
                center={[lat, lon]}
                radius={radius}
                pathOptions={{
                  color: colorForMag(mag),
                  fillOpacity: 0.7,
                  weight: 1,
                }}
              >
                <Popup>
                  <div style={{ minWidth: 180 }}>
                    <strong>{place}</strong>
                    <div>Magnitude: {mag}</div>
                    <div>Time: {time}</div>
                    {q.properties?.url && (
                      <div>
                        <a
                          href={q.properties.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          More info
                        </a>
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MarkerClusterGroup>

        <FitBounds quakes={quakes} />
      </MapContainer>

      {loading && (
        <div className="map-loading" aria-hidden>
          Loading earthquakes...
        </div>
      )}
    </div>
  );
}
