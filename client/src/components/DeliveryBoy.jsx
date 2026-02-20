import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import DeliveryBoyTracking from './DeliveryBoyTracking'
import { FaMapMarkerAlt, FaBoxOpen, FaCheckCircle, FaUserAstronaut } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";

function DeliveryBoy() {
  const { userData } = useSelector(state => state.user)
  const [currentOrder, setCurrentOrder] = useState(null)
  const [availableAssignments, setAvailableAssignments] = useState([])
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(true)

  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, { withCredentials: true })
      setAvailableAssignments(result.data || []);
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  }
  
  const getCurrentOrder = async () => {
    try {
       const result = await axios.get(`${serverUrl}/api/order/accept-current-order`, { withCredentials: true })
       setCurrentOrder(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const acceptOrder = async (assignmentId) => {
    try {
       await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, { withCredentials: true })
       await getCurrentOrder()
       getAssignments();
    } catch (error) {
      console.log(error)
    }
  }

  const sendOtp = async () => {
    try {
       await axios.post(`${serverUrl}/api/order/send-delivery-otp`, {
        orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id
       }, { withCredentials: true })
       setShowOtpBox(true)
    } catch (error) {
      console.log(error)
    }
  }

   const verifyOtp = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp: otp 
        },
        { withCredentials: true }
      );
      setShowOtpBox(false);
      setOtp("");
      setCurrentOrder(null);
      getAssignments();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(userData) {
        getAssignments()
        getCurrentOrder()
    }
  }, [userData])

  return (
    // Added overflow-x-hidden to prevent horizontal scroll
    <div className='w-full min-h-screen flex flex-col items-center bg-[#0D0D0D] overflow-y-auto overflow-x-hidden pb-10 animate-fadeIn'>
      <Nav />
      
      <div className='w-full max-w-[800px] flex flex-col gap-8 items-center mt-24 px-4'>
        
        {/* --- WELCOME CARD --- */}
        <div className='w-full bg-[#1F1F1F] rounded-[30px] shadow-2xl shadow-black/50 p-6 border border-[#333] flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4 animate-slideUp'>
          <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#0D0D0D] flex items-center justify-center border border-[#333]">
                 <FaUserAstronaut className='text-[#FF6B00] w-8 h-8'/>
              </div>
              <div>
                  <h1 className='text-2xl font-bold text-white'>Hello, <span className="text-[#FF6B00]">{userData?.fullName}</span></h1>
                  <p className='text-green-500 text-sm font-semibold flex items-center justify-center sm:justify-start gap-2 mt-1'>
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online & Ready
                  </p>
              </div>
          </div>
          <div className="bg-[#0D0D0D] px-4 py-2 rounded-xl border border-[#333] text-xs text-gray-400">
              <p><span className='text-gray-500 font-bold'>LAT:</span> {userData?.location?.coordinates[1]?.toFixed(4)}</p>
              <p><span className='text-gray-500 font-bold'>LON:</span> {userData?.location?.coordinates[0]?.toFixed(4)}</p>
          </div>
        </div>

        {/* --- AVAILABLE ORDERS SECTION --- */}
        {!currentOrder && (
            <div className='w-full bg-[#1F1F1F] rounded-[30px] p-4 md:p-6 shadow-2xl shadow-black/40 border border-[#333] animate-slideUp' style={{animationDelay: '100ms'}}>
            <div className="flex items-center gap-3 mb-6 border-b border-[#333] pb-4">
                <MdDeliveryDining className="text-[#FF6B00] text-2xl" />
                <h1 className='text-xl font-bold text-white'>Available Tasks</h1>
                <span className="bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold px-2 py-1 rounded-full border border-[#FF6B00]/20">
                    {availableAssignments.length}
                </span>
            </div>

            <div className='space-y-4'>
                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF6B00]"></div>
                    </div>
                ) : availableAssignments.length > 0 ? (
                    availableAssignments.map((a, index) => (
                        <div 
                            className='bg-[#0D0D0D] border border-[#333] rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#FF6B00]/50 transition-all duration-300 group' 
                            key={index}
                        >
                            <div className="space-y-1 w-full sm:w-auto">
                                <h3 className='text-lg font-bold text-white group-hover:text-[#FF6B00] transition-colors'>{a?.shopName}</h3>
                                <p className='text-sm text-gray-400 flex items-start gap-2 break-words'>
                                    <FaMapMarkerAlt className="text-[#FF6B00] mt-1 shrink-0" size={12} />
                                    <span className="flex-1">{a?.deliveryAddress.text}</span>
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-xs bg-[#1F1F1F] text-gray-300 px-2 py-1 rounded border border-[#333]">{a.items.length} Items</span>
                                    <span className="text-xs font-bold text-[#FF6B00]">₹{a.subtotal}</span>
                                </div>
                            </div>
                            <button 
                                className="w-full sm:w-auto bg-[#FF6B00] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-[#FF6B00]/20 hover:bg-[#e65c00] hover:scale-105 active:scale-95 transition-all" 
                                onClick={() => acceptOrder(a.assignmentId)}
                            >
                                Accept Order
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 opacity-50">
                        <FaBoxOpen className="text-6xl text-gray-600 mx-auto mb-3" />
                        <p className='text-gray-400'>No orders available nearby.</p>
                    </div>
                )}
            </div>
            </div>
        )}

        {/* --- CURRENT ORDER SECTION --- */}
        {currentOrder && (
            <div className='w-full bg-[#1F1F1F] rounded-[30px] p-4 md:p-6 shadow-2xl shadow-black/40 border border-[#FF6B00]/30 animate-slideUp relative overflow-hidden'>
                {/* Active Indicator Strip */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B00] to-yellow-500"></div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                    <h2 className='text-xl font-bold text-white flex items-center gap-3'>
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Active Delivery
                    </h2>
                    <span className="text-xs font-mono text-[#FF6B00] border border-[#FF6B00]/30 px-2 py-1 rounded bg-[#FF6B00]/5">
                        ID: {currentOrder.shopOrder?._id.slice(-6).toUpperCase()}
                    </span>
                </div>

                {/* Info Card */}
                <div className='bg-[#0D0D0D] border border-[#333] rounded-2xl p-4 md:p-5 mb-6 space-y-3'>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className='text-xs text-gray-500 uppercase font-bold tracking-wider'>Pickup From</p>
                            <p className='font-bold text-white text-lg'>{currentOrder?.shopOrder?.shop?.name}</p>
                        </div>
                        <div className="text-right">
                             <p className='text-xs text-gray-500 uppercase font-bold tracking-wider'>Order Value</p>
                             <p className='font-bold text-[#FF6B00] text-lg'>₹{currentOrder?.shopOrder?.subtotal}</p>
                        </div>
                    </div>
                    
                    <div className="pt-3 border-t border-[#222]">
                        <p className='text-xs text-gray-500 uppercase font-bold tracking-wider mb-1'>Deliver To</p>
                        <p className='text-gray-300 text-sm flex gap-2 break-words'>
                            <FaMapMarkerAlt className="text-[#FF6B00] mt-0.5 shrink-0" />
                            <span className="flex-1">{currentOrder?.deliveryAddress?.text}</span>
                        </p>
                    </div>
                </div>

                {/* Map Component Container */}
                <div className="rounded-2xl overflow-hidden border border-[#333] h-[300px] mb-6 shadow-inner">
                    <DeliveryBoyTracking data={{
                        deliveryBoyLocation: {
                            lat: userData?.location?.coordinates[1],
                            lon: userData?.location?.coordinates[0]
                        },
                        customerLocation: {
                            lat: currentOrder.deliveryAddress.latitude,
                            lon: currentOrder.deliveryAddress.longitude
                        }
                    }} />
                </div>

                {/* Actions / OTP */}
                {!showOtpBox ? (
                <button
                    className='w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2'
                    onClick={sendOtp}
                >
                    <FaCheckCircle /> Mark as Delivered
                </button>
                ) : (
                // UPDATED OTP BOX FOR MOBILE
                <div className='bg-[#0D0D0D] border border-[#FF6B00]/50 p-4 md:p-6 rounded-2xl animate-fadeIn'>
                    <p className='text-sm text-gray-300 mb-4 text-center'>
                        Ask customer <span className='text-[#FF6B00] font-bold'>{currentOrder?.user?.fullName}</span> for the OTP
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                        <input
                            type='text'
                            className='w-full sm:flex-1 bg-[#1F1F1F] border border-[#333] text-white text-center text-xl tracking-widest px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B00] transition-all min-w-0'
                            placeholder='• • • •'
                            maxLength={4}
                            onChange={(e) => setOtp(e.target.value)} 
                            value={otp}
                        />
                        <button 
                            className='w-full sm:w-auto bg-[#FF6B00] hover:bg-[#e65c00] text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95' 
                            onClick={verifyOtp}
                        >
                            Verify
                        </button>
                    </div>
                </div>
                )}
            </div>
        )}

      </div>
    </div>
  )
}

export default DeliveryBoy