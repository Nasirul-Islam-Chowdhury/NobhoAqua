"use client";
import L from "leaflet";
import { useEffect } from "react";
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { OceanPoint } from "@/lib/types";
import { useTheme } from "./useTheme";

export interface MarkerStyle {
  color: string;
  radius?: number;
  opacity?: number;
  label?: string;
}

interface Props {
  points: OceanPoint[];
  style: (p: OceanPoint) => MarkerStyle;
  selectedId?: number | null;
  onSelect?: (p: OceanPoint) => void;
  height?: string;
}

function FitBounds({ points }: { points: OceanPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const b = L.latLngBounds(points.map((p) => [p.lat, p.lon] as [number, number]));
    map.fitBounds(b, { padding: [40, 40], maxZoom: 10 });
  }, [map, points]);
  return null;
}

export default function OceanMap({ points, style, selectedId, onSelect, height = "100%" }: Props) {
  const { theme } = useTheme();
  const tiles = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  return (
    <MapContainer center={[21.9, 90.1]} zoom={8} scrollWheelZoom={true} style={{ height, width: "100%" }} className={`rounded-2xl ${theme === "dark" ? "dark-tiles" : ""}`}>
      <TileLayer key={tiles} url={tiles} attribution='&copy; OpenStreetMap contributors' />
      <FitBounds points={points} />
      {points.map((p) => {
        const s = style(p);
        const sel = p.id === selectedId;
        return (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lon]}
            radius={sel ? (s.radius ?? 7) + 4 : (s.radius ?? 7)}
            pathOptions={{
              color: sel ? "#ffffff" : s.color,
              weight: sel ? 3 : 1,
              fillColor: s.color,
              fillOpacity: s.opacity ?? 0.75,
            }}
            eventHandlers={{ click: () => onSelect?.(p) }}
          >
            {s.label && <Tooltip>{s.label}</Tooltip>}
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
