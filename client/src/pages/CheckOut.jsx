import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { setAddress, setLocation } from "../redux/mapSlice";
import axios from "axios";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function RecenterMap({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location?.lat && location?.lon) {
      map.setView([location.lat, location.lon], 16, {
        animate: true,
      });
    }
  }, [location, map]);

  return null;
}


function CheckOut() {
  const navigate = useNavigate();
  const { location, address } = useSelector((state) => state.map);
  const defaultPosition = [22.7196, 75.8577]; // Indore (example)
  const mapCenter =
    location?.lat && location?.lon
      ? [location.lat, location.lon]
      : defaultPosition;
  const dispatch=useDispatch()    
const onDragEnd = (e) => {
  const { lat, lng } = e.target.getLatLng();
  dispatch(setLocation({ lat, lon: lng }));
  getAddressByLatLng(lat,lng)
};

const getAddressByLatLng=async(lat,lng)=>{
  try {
    const apiKey = import.meta.env.VITE_GEOAPIKEY
    const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`)
     
     dispatch(setAddress(result?.data?.results[0].address_line2))
  } catch (error) {
    console.log(error)
  }
}

      

  return (
    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-6">
      <div
        className="absolute top-[20px] left-[20px] z-[10]"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
      </div>
      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>

        <section>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800">
            <IoLocationSharp className="text-[#ff4d2d]" />
            Delivery Location
          </h2>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              placeholder="Enter Your Delivery Address..."
              value={address || ""}
            />

            <button className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center">
              <IoSearchOutline size={17} />
            </button>

            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center">
              <TbCurrentLocation size={17} />
            </button>
          </div>
          <div className="rounded-xl border overflow-hidden">
            <div className="h-64 w-full">
              <MapContainer
                className="w-full h-full"
                center={mapCenter}
                zoom={15}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location}/>
                {location?.lat && location?.lon && (
                  <Marker position={[location.lat, location.lon]} draggable eventHandlers=
                  {{dragend:onDragEnd}}/>
                )}
              </MapContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CheckOut;
