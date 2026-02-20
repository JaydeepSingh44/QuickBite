import React, { useEffect, useState } from 'react';
import { FaCheck } from "react-icons/fa6";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { MdDeliveryDining } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function OrderPlaced() {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  // Trigger animations on mount
  useEffect(() => {
    setShowContent(true);
  }, []);

  return (
    // Main Container: Deep Black with Ambient Glow
    <div className='min-h-screen bg-[#0D0D0D] flex flex-col justify-center items-center px-4 relative overflow-hidden'>
      
      {/* --- Background Ambient Effects --- */}
      {/* Orange Glow Top Left */}
      <div className='absolute top-0 left-0 w-[500px] h-[500px] bg-[#FF6B00]/10 rounded-full blur-[120px] pointer-events-none animate-pulse'></div>
      {/* Green Glow Bottom Right (Subtle hint of success) */}
      <div className='absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none'></div>

      {/* --- Main Card --- */}
      <div className={`relative z-10 bg-[#1F1F1F] border border-[#333] p-8 md:p-12 rounded-[40px] shadow-2xl shadow-black/50 text-center max-w-md w-full transform transition-all duration-700 ease-out ${showContent ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
        
        {/* Success Icon Wrapper */}
        <div className='relative mb-8 flex justify-center'>
            {/* Ripples */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-green-500/20 rounded-full blur-xl transition-all duration-1000 delay-300 ${showContent ? 'scale-150 opacity-100' : 'scale-0 opacity-0'}`}></div>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500/10 rounded-full blur-2xl transition-all duration-1000 delay-500 ${showContent ? 'scale-150 opacity-100' : 'scale-0 opacity-0'}`}></div>
            
            {/* The Circle */}
            <div className={`w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)] relative z-10 transform transition-all duration-500 delay-100 cubic-bezier(0.34, 1.56, 0.64, 1) ${showContent ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
                <FaCheck className='text-white text-4xl drop-shadow-md' />
            </div>
        </div>

        {/* Text Content */}
        <h1 className={`text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-wide transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Order Placed!
        </h1>
        
        <p className={`text-gray-400 text-sm md:text-base leading-relaxed mb-8 transition-all duration-700 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Thank you for your purchase. Your food is being prepared with <span className='text-[#FF6B00] font-semibold'>love</span>. 
          Sit back and relax!
        </p>

        {/* Action Buttons */}
        <div className={`flex flex-col gap-3 transition-all duration-700 delay-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            
            {/* Primary Button */}
            <button 
                onClick={() => navigate("/my-orders")}
                className='group relative w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8E26] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#FF6B00]/25 hover:shadow-[#FF6B00]/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 overflow-hidden'
            >
                <div className='absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300'></div>
                <div className='relative flex items-center justify-center gap-2'>
                    <MdDeliveryDining size={24} />
                    <span>Track Order Status</span>
                </div>
            </button>

            {/* Secondary Button */}
            <button 
                onClick={() => navigate("/")}
                className='w-full bg-[#0D0D0D] border border-[#333] text-gray-300 hover:text-white hover:border-[#555] py-4 rounded-2xl font-semibold text-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2'
            >
                <HiOutlineReceiptTax size={18} />
                <span>Continue Shopping</span>
            </button>
        </div>

        {/* Bottom Decoration */}
        <div className='mt-8 pt-6 border-t border-[#333]'>
            <p className='text-xs text-gray-600 uppercase tracking-widest'>QuickBite Delivery</p>
        </div>
      </div>
    </div>
  )
}

export default OrderPlaced;