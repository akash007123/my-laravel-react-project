import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const IndiaMap: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const position: LatLngTuple = [23.149292744011, 75.79426793536513];

  return (
    <MapContainer center={position} zoom={5} className='z-0' style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}>
        <Popup>You're viewing the center of India!</Popup>
      </Marker>
    </MapContainer>
  );
};

export default IndiaMap;
