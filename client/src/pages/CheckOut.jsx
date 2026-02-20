import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoLocationSharp, IoSearchOutline, IoWalletOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { RiSecurePaymentLine } from "react-icons/ri";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useNavigate } from "react-router-dom";
import { setAddress, setLocation } from "../redux/mapSlice";
import axios from "axios";
import { MdDeliveryDining } from "react-icons/md";
import { FaMobileScreenButton, FaCreditCard } from "react-icons/fa6";
import { serverUrl } from "../App";
import { addMyOrder, clearCart } from "../redux/userSlice";
import { IoChevronDown } from "react-icons/io5";
import { ClipLoader } from 'react-spinners'; // Import Spinner

// --- Logic Helpers (Unchanged) ---
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
      map.setView([location.lat, location.lon], 16, { animate: true });
    }
  }, [location, map]);
  return null;
}

function CheckOut() {
  const navigate = useNavigate();
  const { location, address } = useSelector((state) => state.map);
  const { cartItems, totalAmount, userData } = useSelector((state) => state.user);
  const [addressInput, setAddressInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false); // New Loading State

  const defaultPosition = [22.7196, 75.8577];
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const amountWithDeliveryFee = totalAmount + deliveryFee;
  const mapCenter = location?.lat && location?.lon ? [location.lat, location.lon] : defaultPosition;
  const dispatch = useDispatch();

  const onDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    dispatch(setLocation({ lat, lon: lng }));
    getAddressByLatLng(lat, lng);
  };

  const getCurrentLocation = () => {
    const latitude = userData.location.coordinates[1];
    const longitude = userData.location.coordinates[0];
    dispatch(setLocation({ lat: latitude, lon: longitude }));
    getAddressByLatLng(latitude, longitude);
  };

  const getAddressByLatLng = async (lat, lng) => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`
      );
      dispatch(setAddress(result?.data?.results[0].address_line2));
    } catch (error) {
      console.log(error);
    }
  };

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`
      );
      const { lat, lon } = result.data.features[0].properties;
      dispatch(setLocation({ lat, lon }));
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true); // Start Loading
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/place-order`,
        {
          paymentMethod,
          deliveryAddress: { text: addressInput, latitude: location.lat, longitude: location.lon },
          totalAmount,
          cartItems,
        },
        { withCredentials: true }
      );
      if (paymentMethod === "cod") {
        dispatch(addMyOrder(result.data));
        dispatch(clearCart());
        navigate("/order-placed");
      } else {
        const orderId = result.data.orderId;
        const razorOrder = result.data.razorOrder;
        openRazorpayWindow(orderId, razorOrder);
      }
    } catch (error) {
      console.log(error);
      setIsProcessing(false); // Stop loading on error
    }
  };

  const openRazorpayWindow = (orderId, razorOrder) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: "INR",
      name: "QuickBite",
      description: "Food Delivery website",
      order_id: razorOrder.id,
      handler: async function (response) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/order/verify-payment`,
            { razorpay_payment_id: response.razorpay_payment_id, orderId },
            { withCredentials: true }
          );
          dispatch(addMyOrder(result.data));
          navigate("/order-placed");
        } catch (error) {
          console.log(error);
          setIsProcessing(false); // Stop loading on payment fail
        }
      },
      modal: {
        ondismiss: function() {
            setIsProcessing(false); // Stop loading if user closes modal
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    setAddressInput(address);
  }, [address]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-gray-200 pb-10 pt-24 px-4 md:px-8 lg:px-16 animate-fadeIn selection:bg-[#FF6B00] selection:text-white">
      
      {/* --- Floating Header --- */}
      <div className="fixed top-0 left-0 w-full h-20 bg-[#0D0D0D]/90 backdrop-blur-md z-40 border-b border-[#1F1F1F] flex items-center px-4 md:px-16 justify-between">
        <div className="flex items-center gap-4">
             <div 
                className="w-10 h-10 rounded-full bg-[#1F1F1F] border border-[#333] flex items-center justify-center 
                    cursor-pointer hover:bg-[#FF6B00] hover:border-[#FF6B00] 
                    active:bg-[#FF6B00] active:border-[#FF6B00]
                    group transition-all duration-300 active:scale-95" 
                onClick={() => navigate("/cart")}
             >
                <IoIosArrowRoundBack size={28} className="text-[#FF6B00] group-hover:text-white transition-colors" />
             </div>
             <h1 className="text-2xl font-bold tracking-wider text-white">Checkout</h1>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[#FF6B00] bg-[#FF6B00]/10 px-4 py-2 rounded-full border border-[#FF6B00]/20">
            <RiSecurePaymentLine size={18} />
            <span className="text-sm font-semibold">100% Secure Payment</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* === LEFT COLUMN === */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8 animate-slideUp">
          
          {/* Location Card */}
          <div className="bg-[#1F1F1F] rounded-[30px] p-6 md:p-8 border border-[#333] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/5 rounded-full blur-3xl -z-10 transition-all group-hover:bg-[#FF6B00]/10"></div>
            
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#0D0D0D] rounded-xl text-[#FF6B00] border border-[#333]">
                    <IoLocationSharp size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Delivery Location</h2>
                    <p className="text-xs text-gray-500">Where should we drop your food?</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <input
                    type="text"
                    className="w-full bg-[#0D0D0D] border border-[#333] rounded-xl px-4 py-3 pl-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all"
                    placeholder="Search location or drag marker..."
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button onClick={getLatLngByAddress} className="bg-[#262626] hover:bg-[#FF6B00] active:bg-[#FF6B00] 
                  text-gray-400 hover:text-white active:text-white 
                  px-4 py-3 rounded-xl transition-all duration-300 
                  border border-[#333] hover:border-[#FF6B00] active:border-[#FF6B00]">
                        <IoSearchOutline size={20} />
                    </button>
                    <button onClick={getCurrentLocation} className="bg-[#262626] hover:bg-blue-600 active:bg-blue-600
                          text-gray-400 hover:text-white active:text-white
                          px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-2
                          border border-[#333] hover:border-blue-500 active:border-blue-500">
                        <TbCurrentLocation size={20} />
                        <span className="hidden sm:block text-sm font-medium">Locate Me</span>
                    </button>
                </div>
            </div>

            <div className="h-[350px] w-full rounded-[24px] overflow-hidden border border-[#333] shadow-inner relative z-0">
                <MapContainer className="w-full h-full grayscale-[50%] contrast-[1.1]" center={mapCenter} zoom={15} scrollWheelZoom={true}>
                    <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <RecenterMap location={location} />
                    {location?.lat && location?.lon && <Marker position={[location.lat, location.lon]} draggable eventHandlers={{ dragend: onDragEnd }} />}
                </MapContainer>
            </div>
          </div>

          <div className="flex justify-center -mt-2 -mb-2">
            <div className="flex flex-col items-center text-gray-500 animate-bounce">
                <span className="text-xs mb-1 tracking-wider uppercase">Scroll</span>
                <IoChevronDown size={30} className="text-[#FF6B00]" />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-[#1F1F1F] rounded-[30px] p-6 md:p-8 border border-[#333] shadow-2xl relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF6B00]/5 rounded-full blur-3xl -z-10 transition-all group-hover:bg-[#FF6B00]/10"></div>

            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#0D0D0D] rounded-xl text-[#FF6B00] border border-[#333]">
                    <IoWalletOutline size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Payment Method</h2>
                    <p className="text-xs text-gray-500">Choose how you want to pay</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div 
                    onClick={() => setPaymentMethod("cod")}
                    className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center gap-4 overflow-hidden
                    ${paymentMethod === "cod" ? "bg-gradient-to-br from-[#FF6B00]/20 to-[#FF6B00]/5 border-[#FF6B00] shadow-[0_0_20px_rgba(255,107,0,0.15)]" : "bg-[#0D0D0D] border-[#333] hover:border-[#555] opacity-60 hover:opacity-100"}`}
                >
                    <div className={`p-3 rounded-full ${paymentMethod === "cod" ? "bg-[#FF6B00] text-white" : "bg-[#1F1F1F] text-gray-400"}`}>
                        <MdDeliveryDining size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">Cash On Delivery</h3>
                        <p className="text-xs text-gray-400">Pay cash upon arrival</p>
                    </div>
                    {paymentMethod === "cod" && <div className="absolute top-3 right-3 w-3 h-3 bg-[#FF6B00] rounded-full shadow-[0_0_10px_#FF6B00]"></div>}
                </div>

                <div 
                    onClick={() => setPaymentMethod("online")}
                    className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center gap-4 overflow-hidden
                    ${paymentMethod === "online" ? "bg-gradient-to-br from-[#FF6B00]/20 to-[#FF6B00]/5 border-[#FF6B00] shadow-[0_0_20px_rgba(255,107,0,0.15)]" : "bg-[#0D0D0D] border-[#333] hover:border-[#555] opacity-60 hover:opacity-100"}`}
                >
                    <div className={`p-3 rounded-full flex gap-1 ${paymentMethod === "online" ? "bg-[#FF6B00] text-white" : "bg-[#1F1F1F] text-gray-400"}`}>
                         <FaMobileScreenButton size={14} />
                         <FaCreditCard size={14} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">Online Payment</h3>
                        <p className="text-xs text-gray-400">UPI, Cards, NetBanking</p>
                    </div>
                    {paymentMethod === "online" && <div className="absolute top-3 right-3 w-3 h-3 bg-[#FF6B00] rounded-full shadow-[0_0_10px_#FF6B00]"></div>}
                </div>
            </div>
          </div>
        </div>


        {/* === RIGHT COLUMN: Sticky Order Summary === */}
        <div className="lg:col-span-5 xl:col-span-4 animate-slideUp" style={{animationDelay: '100ms'}}>
            <div className="sticky top-24">
                <div className="bg-[#1F1F1F] rounded-[30px] p-6 border border-[#333] shadow-2xl relative">
                    
                    <h2 className="text-xl font-bold text-white mb-6 flex justify-between items-center">
                        Order Summary
                        <span className="text-xs font-normal text-gray-400 bg-[#0D0D0D] px-2 py-1 rounded-lg border border-[#333]">{cartItems.length} Items</span>
                    </h2>

                    <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                        {cartItems.map((item, index) => (
                            <div key={index} className="flex justify-between items-center bg-[#0D0D0D] p-3 rounded-xl border border-[#262626]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden">
                                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-200 line-clamp-1">{item.name}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-white">₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t-2 border-dashed border-[#333] my-4 relative">
                        <div className="absolute -left-8 -top-3 w-6 h-6 bg-[#0D0D0D] rounded-full"></div>
                        <div className="absolute -right-8 -top-3 w-6 h-6 bg-[#0D0D0D] rounded-full"></div>
                    </div>

                    <div className="space-y-3 mb-8">
                        <div className="flex justify-between text-gray-400 text-sm">
                            <span>Subtotal</span>
                            <span>₹{totalAmount}</span>
                        </div>
                        <div className="flex justify-between text-gray-400 text-sm">
                            <span>Delivery Fee</span>
                            <span className={deliveryFee === 0 ? "text-green-500 font-bold" : ""}>
                                {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                            </span>
                        </div>
                        <div className="flex justify-between text-gray-400 text-sm">
                            <span>Platform Fee</span>
                            <span>₹0</span>
                        </div>
                    </div>

                    <div className="bg-[#0D0D0D] rounded-2xl p-4 border border-[#333]">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-300 font-medium">Grand Total</span>
                            <span className="text-2xl font-extrabold text-[#FF6B00]">₹{amountWithDeliveryFee}</span>
                        </div>
                        
                        <button 
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8E26] text-white font-bold text-lg 
                            shadow-lg shadow-[#FF6B00]/30 hover:shadow-[#FF6B00]/50 active:shadow-[#FF6B00]/60 hover:scale-[1.02] active:scale-95 transition-all duration-300 relative overflow-hidden group flex justify-center items-center gap-2 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isProcessing ? (
                                    <>
                                        <ClipLoader size={20} color="white" />
                                        Processing Order...
                                    </>
                                ) : (
                                    paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"
                                )}
                            </span>
                            {!isProcessing && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-sm"></div>}
                        </button>
                    </div>

                    <div className="mt-4 flex justify-center gap-2 text-xs text-gray-600">
                        <RiSecurePaymentLine />
                        <span>256-bit SSL Encrypted Payment</span>
                    </div>

                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

export default CheckOut;