"use client";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix for missing default icon in Leaflet + Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Marker with Gold Glow
const customIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `<div style="background-color: #cb9e0bff; width: 24px; height: 24px; border-radius: 50%; box-shadow: 0 0 20px #cb9e0bff; cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.3)'" onmouseout="this.style.transform='scale(1)'"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function Map({ onMarkerHover }) {
  // Fix map rendering issues in some React environments
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={[33.5731, -7.5898]} 
        zoom={12} 
        style={{ height: '100%', width: '100%', backgroundColor: '#050505' }}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        attributionControl={false}
      >
        {/* CartoDB Dark Matter Base Map */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        />
        
        <Marker 
          position={[33.5731, -7.5898]} 
          icon={customIcon}
          eventHandlers={{
            mouseover: () => {
              if(onMarkerHover) onMarkerHover(true);
            }
          }}
        />
      </MapContainer>
      
      {/* Overlay gradient to blend map edges into the dark background */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_40px_#050505] z-10" />
    </div>
  );
}
