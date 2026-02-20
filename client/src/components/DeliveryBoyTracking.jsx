import React from 'react';
import scooter from "../assets/scooter.png"; // Ensure you have this or use a generic marker
import home from "../assets/home.png"; // Ensure you have this
import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import "leaflet/dist/leaflet.css"; // Essential for map rendering

// Fix default icons if images are missing, otherwise custom icons:
const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter, 
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -40]
});

const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35]
});

function DeliveryBoyTracking({ data }) {
  // Handle different data structures passed from parent
  // Case 1: Direct structure { deliveryBoyLocation: {lat, lon}, customerLocation: {lat, lon} }
  // Case 2: Nested inside currentOrder object (rare, but defensive coding helps)
  
  let deliveryBoyLat, deliveryBoyLon, customerLat, customerLon;

  if (data?.deliveryBoyLocation) {
      deliveryBoyLat = data.deliveryBoyLocation.lat;
      deliveryBoyLon = data.deliveryBoyLocation.lon;
      customerLat = data.customerLocation.lat;
      customerLon = data.customerLocation.lon;
  } else {
      // Fallback or error state
      return <div className="text-white text-center p-4">Location data unavailable</div>;
  }

  const path = [
    [deliveryBoyLat, deliveryBoyLon],
    [customerLat, customerLon]
  ];

  const center = [deliveryBoyLat, deliveryBoyLon];

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        className="w-full h-full grayscale-[50%] contrast-[1.1]" // Dark mode map effect
        center={center}
        zoom={14}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={[deliveryBoyLat, deliveryBoyLon]} icon={deliveryBoyIcon}>
          <Popup className="custom-popup">You are here</Popup>
        </Marker>

        <Marker position={[customerLat, customerLon]} icon={customerIcon}>
          <Popup className="custom-popup">Customer Location</Popup>
        </Marker>

        <Polyline positions={path} color='#FF6B00' weight={5} dashArray="10, 10" opacity={0.8} />

      </MapContainer>
    </div>
  );
}

export default DeliveryBoyTracking;