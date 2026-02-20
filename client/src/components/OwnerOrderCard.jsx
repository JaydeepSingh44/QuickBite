import React, { useState } from 'react';
import axios from "axios"
import { serverUrl } from '../App'
import { MdPhone, MdLocationOn, MdDeliveryDining, MdCheckCircle } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/userSlice';

// Fallback image for deleted items
const PLACEHOLDER_IMG = "https://placehold.co/100x100/1F1F1F/FF6B00?text=Deleted";

function OwnerOrderCard({data}) {
  const [availableBoys,setAvailableBoys]=useState([])
  const dispatch=useDispatch()
  
  const handleUpdateStatus = async (orderId, shopId, status) => {
    try {
        const result = await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`, {status}, {withCredentials: true})
        dispatch(updateOrderStatus({orderId,shopId,status}))
        setAvailableBoys(result.data.availableBoys)
    } catch (error) {
        console.log(error)
    }
  }

  const isDelivered = data.shopOrders.status === "delivered";

  return (
    // Dark Card
    <div className={`bg-[#1A1A1A] rounded-[24px] p-6 border ${isDelivered ? 'border-green-500/30' : 'border-[#333]'} hover:border-gray-600 transition-all duration-300 h-full flex flex-col`}>
      
      {/* Top Bar: User Info */}
      <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#e64526] flex items-center justify-center text-white font-bold shadow-lg shadow-[#FF6B00]/20">
                  {data.user.fullName.charAt(0)}
              </div>
              <div>
                  <h2 className='text-white font-bold text-base'>{data.user.fullName}</h2>
                  <p className='text-xs text-gray-500 flex items-center gap-1'>
                     <MdPhone className="text-[#FF6B00]" /> {data.user.mobile}
                  </p>
              </div>
          </div>
          
          <div className='text-right'>
             <div className='text-2xl font-bold text-white'>₹{data.shopOrders?.subtotal}</div>
             <div className='text-[10px] text-gray-500 uppercase tracking-widest'>Total</div>
          </div>
      </div>

      {/* Address Block */}
      <div className='bg-[#141414] p-4 rounded-xl border border-[#262626] mb-5 flex gap-3'>
        <MdLocationOn className='text-[#FF6B00] text-xl shrink-0' />
        <div>
            <p className='text-gray-300 text-sm leading-snug'>{data?.deliveryAddress?.text}</p>
        </div>
      </div>

      {/* Items Grid (Visual Representation) */}
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6'>
        {data.shopOrders.shopOrderItems.map((item, index) => (
            <div key={index} className='bg-[#262626] rounded-lg p-2 flex flex-col items-center text-center border border-[#333]'>
                
                {/* 🔥 FIX: Check if item.item exists before accessing image */}
                <img 
                    src={item.item?.image || PLACEHOLDER_IMG} 
                    alt='food' 
                    className='w-full h-16 object-cover rounded-md mb-2 opacity-80 hover:opacity-100 transition-opacity'
                />
                
                {/* Fallback for name is usually not needed as order schema saves name, but safe to keep */}
                <p className='text-gray-200 text-xs font-medium truncate w-full'>
                    {item.name || "Unknown Item"}
                </p>
                <p className='text-[10px] text-gray-500'>Qty: {item.quantity}</p>
            </div>
        ))}
     </div>

     {/* Controls & Status - Pushed to bottom */}
     <div className='mt-auto space-y-4'>
        
        {/* Logic: If Delivered, Show Badge. If Not, Show Dropdown */}
        {isDelivered ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 flex items-center justify-center gap-2 animate-fadeIn">
                <MdCheckCircle className="text-green-500 text-2xl" />
                <span className="text-green-500 font-bold uppercase tracking-wider text-sm">Order Delivered</span>
            </div>
        ) : (
            <div className='bg-[#262626] rounded-xl p-1 flex items-center justify-between border border-[#333]'>
                <span className='pl-3 text-xs text-gray-400 font-medium uppercase'>Order Status</span>
                <select 
                    className='bg-[#1A1A1A] text-white text-sm font-semibold py-2 px-4 rounded-lg outline-none cursor-pointer hover:bg-[#333] transition-colors border-l border-[#333]' 
                    onChange={(e)=>handleUpdateStatus( data._id, data.shopOrders.shop._id,e.target.value)}
                    defaultValue={data.shopOrders.status}
                >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="out_for_delivery">Out For Delivery</option>
                </select>
            </div>
        )}

        {/* Delivery Assignment UI (Only if Out for Delivery and NOT Delivered) */}
        {data.shopOrders.status === "out_for_delivery" && !isDelivered && (
            <div className="animate-fadeIn">
                {data.shopOrders.assignedDeliveryBoy ? (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-center gap-3">
                        <MdDeliveryDining className="text-blue-400 text-xl" />
                        <div>
                            <p className="text-blue-400 text-xs font-bold uppercase">On the way</p>
                            <p className="text-white text-sm">{data.shopOrders.assignedDeliveryBoy.fullName}</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-xl p-3">
                        <p className="text-[#FF6B00] text-xs font-bold uppercase mb-2">Available Drivers</p>
                        <div className="flex flex-wrap gap-2">
                            {availableBoys?.length > 0 ? availableBoys.map((b, i) => (
                                <span key={i} className="bg-[#FF6B00] text-white text-xs px-2 py-1 rounded-md">{b.fullName}</span>
                            )) : <span className="text-gray-500 text-xs italic">Scanning nearby...</span>}
                        </div>
                    </div>
                )}
            </div>
        )}
     </div>

    </div>
  )
}

export default OwnerOrderCard;