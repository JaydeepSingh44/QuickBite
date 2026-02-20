import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaMapMarkerAlt, FaUserAstronaut, FaPhoneAlt, FaBoxOpen } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { HiCheckCircle } from "react-icons/hi";
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import DeliveryBoyTracking from '../components/DeliveryBoyTracking';

function TrackOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleGetOrder = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, { withCredentials: true });
      setCurrentOrder(result.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF6B00]"></div>
      </div>
    );
  }

  return (
    // Main Container: Deep Black (#0D0D0D)
    <div className='min-h-screen bg-[#0D0D0D] text-gray-200 pb-10 pt-10 px-4 md:px-8 overflow-y-auto scroll-smooth animate-fadeIn'>
      
      {/* --- Header Section --- */}
      <div className='max-w-5xl mx-auto mb-8 flex items-center justify-between animate-slideUp'>
        <div className="flex items-center gap-4">
            <div 
                className="w-12 h-12 rounded-full bg-[#1F1F1F] border border-[#333] flex items-center justify-center 
                cursor-pointer hover:bg-[#FF6B00] group transition-all duration-300 shadow-lg shadow-black/50" 
                onClick={() => navigate("/my-orders")}
            >
                <IoIosArrowRoundBack size={32} className="text-[#FF6B00] group-hover:text-white transition-colors" />
            </div>
            <div>
                <h1 className='text-3xl font-bold text-white tracking-wide'>Track Order</h1>
                <p className='text-gray-500 text-sm'>Order ID: #{orderId?.slice(-6).toUpperCase()}</p>
            </div>
        </div>
      </div>

      <div className='max-w-5xl mx-auto flex flex-col gap-8'>
        {currentOrder?.shopOrders?.map((shopOrder, index) => (
          
          // --- Order Card ---
          <div 
            key={index} 
            className="bg-[#1F1F1F] rounded-[30px] border border-[#333] overflow-hidden shadow-2xl shadow-black/40 
            animate-slideUp transition-all duration-500 hover:border-[#FF6B00]/30"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            
            {/* 1. Header & Status */}
            <div className="p-6 md:p-8 border-b border-[#333] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#262626]">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#0D0D0D] rounded-xl text-[#FF6B00] border border-[#333]">
                        <FaBoxOpen size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{shopOrder.shop.name}</h2>
                        <p className="text-sm text-gray-400">{shopOrder.shopOrderItems?.length} Items included</p>
                    </div>
                </div>

                {/* Live Status Badge */}
                <div className={`px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-bold uppercase tracking-wider
                    ${shopOrder.status === 'delivered' 
                        ? 'bg-green-900/20 border-green-700 text-green-500' 
                        : 'bg-[#FF6B00]/10 border-[#FF6B00]/50 text-[#FF6B00]'}`
                }>
                    {shopOrder.status !== 'delivered' && (
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF6B00]"></span>
                        </span>
                    )}
                    {shopOrder.status.replace('_', ' ')}
                </div>
            </div>

            {/* 2. Details Grid */}
            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Column: Info */}
                <div className="space-y-6">
                    {/* Items List */}
                    <div className="bg-[#0D0D0D] rounded-2xl p-4 border border-[#333]">
                        <p className="text-xs text-gray-500 uppercase mb-2 font-bold tracking-widest">Items Ordered</p>
                        <div className="flex flex-wrap gap-2">
                            {shopOrder.shopOrderItems?.map((i, idx) => (
                                <span key={idx} className="bg-[#1F1F1F] text-gray-300 px-3 py-1 rounded-lg text-sm border border-[#333]">
                                    {i.item?.name} <span className="text-[#FF6B00] text-xs">x{i.quantity}</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Address & Cost */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                             <FaMapMarkerAlt className="text-[#FF6B00] mt-1 shrink-0" />
                             <div>
                                 <p className="text-sm font-bold text-white">Delivery Address</p>
                                 <p className="text-sm text-gray-400 leading-relaxed">{currentOrder.deliveryAddress?.text}</p>
                             </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className="font-bold text-gray-400 text-sm">Order Subtotal:</div>
                             <div className="font-bold text-white text-lg">₹{shopOrder.subtotal}</div>
                        </div>
                    </div>

                    {/* Delivery Boy Status Card */}
                    {shopOrder.status === "delivered" ? (
                        <div className="mt-4 p-4 bg-green-900/10 border border-green-800 rounded-2xl flex items-center gap-4">
                            <HiCheckCircle className="text-green-500 text-4xl" />
                            <div>
                                <p className="text-green-500 font-bold text-lg">Order Delivered</p>
                                <p className="text-green-700/80 text-sm">Enjoy your meal!</p>
                            </div>
                        </div>
                    ) : shopOrder.assignedDeliveryBoy ? (
                        <div className="mt-4 bg-gradient-to-br from-[#1F1F1F] to-[#0D0D0D] border border-[#FF6B00]/30 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                            {/* Glow Effect */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-[#FF6B00]/10 rounded-full blur-2xl -z-10 group-hover:bg-[#FF6B00]/20 transition-all"></div>
                            
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#262626] flex items-center justify-center border-2 border-[#333]">
                                    <FaUserAstronaut className="text-gray-400 text-2xl" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-[#FF6B00] font-bold uppercase tracking-wider mb-1">Delivery Partner</p>
                                    <p className="text-white font-bold text-lg">{shopOrder.assignedDeliveryBoy.fullName}</p>
                                    <div className="flex items-center gap-2 mt-1 text-gray-400 text-sm">
                                        <FaPhoneAlt size={12} />
                                        <span>{shopOrder.assignedDeliveryBoy.mobile}</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#FF6B00] flex items-center justify-center text-white shadow-lg shadow-[#FF6B00]/30 animate-pulse">
                                    <MdDeliveryDining size={20} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4 p-5 bg-[#262626] rounded-2xl border border-dashed border-gray-600 flex items-center gap-3 opacity-70">
                            <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                            <p className="font-semibold text-gray-400 text-sm">Assigning a delivery partner...</p>
                        </div>
                    )}
                </div>

                {/* Right Column: Map */}
                <div className="h-full min-h-[300px] lg:min-h-[400px]">
                    {shopOrder.assignedDeliveryBoy && shopOrder.status !== "delivered" ? (
                        <div className="h-full w-full rounded-2xl overflow-hidden border border-[#333] shadow-inner relative group">
                            <div className="absolute top-3 left-3 z-[400] bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                                <p className="text-xs text-white font-bold flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Live Tracking
                                </p>
                            </div>
                            <div className="w-full h-full grayscale-[20%] contrast-[1.1] transition-all duration-700 group-hover:grayscale-0">
                                <DeliveryBoyTracking data={{
                                    deliveryBoyLocation: {
                                    lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                                    lon: shopOrder.assignedDeliveryBoy.location.coordinates[0]
                                    },
                                    customerLocation: {
                                    lat: currentOrder.deliveryAddress.latitude,
                                    lon: currentOrder.deliveryAddress.longitude
                                    }
                                }}/>
                            </div>
                        </div>
                    ) : (
                        // Placeholder Map State
                        <div className="h-full w-full rounded-2xl bg-[#0D0D0D] border border-[#333] flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px]"></div>
                             <FaMapMarkerAlt className="text-gray-700 text-6xl mb-4" />
                             <p className="text-gray-500 font-medium">
                                 {shopOrder.status === 'delivered' ? "Order Delivered" : "Map will activate once partner is assigned"}
                             </p>
                        </div>
                    )}
                </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrackOrderPage;