import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaChevronRight, FaBox, FaUtensils } from "react-icons/fa6";

// Fallback image in case the actual food item was deleted from the database
const PLACEHOLDER_IMG = "https://placehold.co/100x100/1F1F1F/FF6B00?text=Deleted";

function UserOrderCard({ data }) {
   const navigate = useNavigate()
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch(status) {
        case 'delivered': return 'text-green-400 bg-green-400/10 border-green-400/20';
        case 'preparing': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        case 'out_for_delivery': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
        default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  }

  return (
    <div className="bg-[#1A1A1A] rounded-[24px] p-6 border border-[#333] hover:border-[#FF6B00]/50 
    hover:shadow-[0_0_30px_-10px_rgba(255,107,0,0.15)] transition-all duration-300 h-full flex flex-col justify-between group">
      
      {/* Top Section */}
      <div>
        <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#262626] flex items-center justify-center text-[#FF6B00] shadow-inner">
                    <FaBox size={20} />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg tracking-wide">Order #{data._id.slice(-6).toUpperCase()}</h3>
                    <p className="text-gray-500 text-xs mt-1">{formatDate(data.createdAt)} • {data.paymentMethod}</p>
                </div>
            </div>
            
            {/* Safe check for status */}
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(data.shopOrders?.[0]?.status)}`}>
                {data.shopOrders?.[0]?.status?.replace(/_/g, " ") || "Pending"}
            </div>
        </div>

        {/* Separator Line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#333] to-transparent mb-5"></div>

        {/* Order Items */}
        <div className="space-y-4 mb-6">
            {data.shopOrders.map((shopOrder, idx) => (
                <div key={idx} className="bg-[#141414] rounded-xl p-3 border border-[#262626]">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-[#FF6B00]"></span>
                        {/* Safe check for Shop Name in case Shop is deleted */}
                        <p className="text-gray-300 text-sm font-semibold">{shopOrder.shop?.name || "Unknown Shop"}</p>
                    </div>
                    
                    {/* Horizontal Scroll Items */}
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {shopOrder.shopOrderItems.map((item, i) => (
                            <div key={i} className="flex-shrink-0 flex items-center gap-3 bg-[#1A1A1A] pr-4 rounded-lg border border-[#333]">
                                
                                {/* 🔥 FIX IS HERE: Optional Chaining (?.) and Fallback (||) */}
                                <img 
                                    src={item.item?.image || PLACEHOLDER_IMG} 
                                    alt="food" 
                                    className="w-10 h-10 object-cover rounded-l-lg" 
                                />
                                
                                <div className="flex flex-col">
                                    <span className="text-gray-200 text-xs font-medium truncate max-w-[100px]">{item.name}</span>
                                    <span className="text-[10px] text-gray-500">x{item.quantity}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto bg-[#262626] rounded-2xl p-4 flex justify-between items-center border border-[#333]">
        <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Total Amount</p>
            <p className="text-xl font-bold text-white">₹{data.totalAmount}</p>
        </div>
        <button 
            onClick={()=>navigate(`/track-order/${data._id}`)}
            className="bg-[#FF6B00] hover:bg-white hover:text-[#FF6B00] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 group-hover:scale-105 active:scale-95 shadow-lg shadow-[#FF6B00]/20"
        >
            Track Order <FaChevronRight size={10} />
        </button>
      </div>

    </div>
  )
}

export default UserOrderCard