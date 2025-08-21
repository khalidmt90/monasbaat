// app/halls/map/page.tsx
"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import { halls } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export default function HallsMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Basic style: OSM raster tiles (no key)
    const map = new maplibregl.Map({
      container: mapRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: [46.6753, 24.7136], // Riyadh
      zoom: 9,
      hash: false,
    });

    // If you get a MapTiler key, use a nicer vector style:
    // const map = new maplibregl.Map({
    //   container: mapRef.current,
    //   style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
    //   center: [46.6753, 24.7136],
    //   zoom: 9
    // });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

    halls.filter(h => h.lng && h.lat).forEach(h => {
      const el = document.createElement("div");
      el.className = "marker-card";
      el.innerHTML = `<div class="marker-inner">${formatPrice(h.basePrice)} ر.س</div>`;
      el.onclick = () => {
        const html = `
          <div style="min-width:220px">
            <div style="font-weight:700">${h.name}</div>
            <div style="color:#6b7280">${h.city} • ${h.area}</div>
            <div style="margin-top:4px">ابتداءً من <b>${formatPrice(h.basePrice)}</b> ر.س</div>
            <div style="margin-top:6px">
              <a href="/halls/${h.id}" class="link">عرض التفاصيل</a>
            </div>
          </div>`;
        new maplibregl.Popup({ closeOnClick: true }).setLngLat([h.lng, h.lat]).setHTML(html).addTo(map);
      };

      new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([h.lng, h.lat])
        .addTo(map);
    });

    mapInstance.current = map;
    return () => map.remove();
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">القاعات على الخريطة</h1>
          <Link href="/halls" className="btn btn-ghost">قائمة النتائج</Link>
        </div>
      </div>

      <div className="container !max-w-none">
        <div className="grid lg:grid-cols-[1fr_380px] gap-3">
          <div ref={mapRef} className="h-[70vh] rounded-xl overflow-hidden border" />
          <div className="card p-3 h-[70vh] overflow-auto">
            {halls.map(h => (
              <div key={h.id} className="p-3 border-b last:border-0">
                <div className="font-bold">{h.name}</div>
                <div className="text-gray-600 text-sm">{h.city} • {h.area}</div>
                <div className="text-sm mt-1">ابتداءً من <b>{formatPrice(h.basePrice)}</b> ر.س</div>
                <Link href={`/halls/${h.id}`} className="btn btn-ghost mt-2">عرض التفاصيل</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marker styles */}
      <style jsx global>{`
        .marker-card { transform: translateY(-6px); }
        .marker-inner {
          background: #111827;
          color: #fff;
          border: 2px solid #C9A227;
          padding: 6px 10px;
          font-size: 12px;
          border-radius: 999px;
          box-shadow: 0 10px 18px rgba(0,0,0,.25);
          cursor: pointer;
          transition: transform .2s ease;
        }
        .marker-inner:hover { transform: translateY(-2px); }
        .maplibregl-ctrl button { outline: none; }
        .maplibregl-popup-content .link { color:#2563EB; text-decoration:none }
        .maplibregl-popup-content .link:hover { text-decoration:underline }
      `}</style>
    </section>
  );
}
