import React, { useState } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsCartX } from "react-icons/bs";
import { ClipLoader } from 'react-spinners'; // Make sure react-spinners is installed
import CardItemCard from '../components/CardItemCard'; 

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector(state => state.user)
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate a brief processing delay or wait for navigation
    setTimeout(() => {
        navigate("/checkout");
        setIsCheckingOut(false);
    }, 500); 
  };

  return (
    // Main Container: Dark Theme, Padding top for fixed Navbar
    <div className="min-h-screen bg-[#0D0D0D] text-gray-200 pt-[40px] px-4 md:px-8 lg:px-20 pb-10 flex justify-center">
      
      <div className="w-full max-w-[1200px]">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <div 
            className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center cursor-pointer hover:bg-[#FF6B00] group transition-all duration-300" 
            onClick={() => navigate("/")}
          >
            <IoIosArrowRoundBack size={30} className="text-[#FF6B00] group-hover:text-white transition-colors" />
          </div>
          <h1 className='text-3xl font-extrabold tracking-wide text-white'>Your Cart</h1>
          <span className='text-gray-500 font-medium text-lg ml-2'>({cartItems.length} items)</span>
        </div>

        {cartItems?.length === 0 ? (
            // --- EMPTY CART STATE ---
            <div className='flex flex-col items-center justify-center py-20 animate-fadeIn'>
                <div className='w-32 h-32 bg-[#1F1F1F] rounded-full flex items-center justify-center mb-6'>
                    <BsCartX size={60} className='text-gray-600' />
                </div>
                <h2 className='text-2xl font-bold text-gray-300 mb-2'>Your Cart is Empty</h2>
                <p className='text-gray-500 mb-8'>Looks like you haven't added any food yet.</p>
                <button 
                    className='px-8 py-3 bg-[#FF6B00] text-white font-bold rounded-full shadow-lg shadow-[#FF6B00]/20 hover:scale-105 transition-transform'
                    onClick={() => navigate("/")}
                >
                    Browse Food
                </button>
            </div>
        ) : (
            // --- FILLED CART LAYOUT (Responsive) ---
            <div className='flex flex-col lg:flex-row gap-8 relative'>
                
                {/* Left Side: Cart Items List */}
                <div className='w-full lg:w-[65%] space-y-4'>
                  {cartItems?.map((item, index) => (
                    <div key={index} className="animate-slideUp"> 
                        <CardItemCard data={item} />
                    </div>
                  ))}
                </div>

                {/* Right Side: Order Summary (Sticky on Desktop) */}
                <div className='w-full lg:w-[35%]'>
                    <div className='bg-[#1F1F1F] p-6 rounded-2xl border border-gray-800 shadow-xl lg:sticky lg:top-[110px]'>
                        <h2 className='text-xl font-bold text-white mb-6 border-b border-gray-700 pb-4'>Order Summary</h2>
                        
                        <div className='space-y-3 mb-6'>
                            <div className='flex justify-between text-gray-400'>
                                <span>Subtotal</span>
                                <span>₹{totalAmount}</span>
                            </div>
                            <div className='flex justify-between text-gray-400'>
                                <span>Delivery Fee</span>
                                <span className='text-green-500'>Free</span>
                            </div>
                        </div>

                        {/* Dashed Divider */}
                        <div className='border-t-2 border-dashed border-gray-700 my-4'></div>

                        <div className="flex justify-between items-center mb-8">
                            <h1 className='text-xl font-bold text-white'>Total</h1>
                            <span className='text-2xl font-extrabold text-[#FF6B00]'>
                                ₹{totalAmount}
                            </span>
                        </div>

                        <button 
                             className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8E26] text-white font-bold text-lg 
                            shadow-lg shadow-[#FF6B00]/30 hover:shadow-[#FF6B00]/50 active:shadow-[#FF6B00]/60 hover:scale-[1.02] active:scale-95 transition-all duration-300 relative overflow-hidden group flex justify-center items-center gap-2"
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isCheckingOut ? (
                                    <>
                                        <ClipLoader size={20} color='white' />
                                        Processing...
                                    </>
                                ) : (
                                    "Proceed to Checkout"
                                )}
                            </span>
                            {!isCheckingOut && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-sm"></div>}
                        </button>
                        
                        <p className='text-center text-gray-500 text-xs mt-4'>
                            Review your order before payment.
                        </p>
                    </div>
                </div>

            </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;