import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App'
import { useNavigate, useParams } from 'react-router-dom'
// FIXED: Removed FaMapMarkerAlt, utilizing FaLocationDot instead
import { FaStore, FaLocationDot, FaUtensils, FaArrowLeft, FaStar } from "react-icons/fa6";
import FoodCard from '../components/FoodCard'
import { useSelector } from 'react-redux';

function Shop() {
  const { shopId } = useParams()
  const { currentCity } = useSelector(state => state.user)
  const [items, setItems] = useState([])
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleShop = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`, { withCredentials: true })
      setShop(result.data.shop)
      setItems(result.data.items)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
     handleShop()
     window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [shopId])

  // --- CHECK IF DELIVERABLE ---
  // A shop is deliverable ONLY if its city matches the user's current city
  // Using optional chaining and safe lowercasing to prevent errors
  const isDeliverable = shop?.city?.toLowerCase() === currentCity?.toLowerCase();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF6B00]"></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#0D0D0D] text-gray-200 animate-fadeIn relative scroll-smooth'>
      
      {/* --- Floating Back Button --- */}
      <button
        className="fixed top-6 left-6 z-50 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center 
        text-white border border-white/10 hover:bg-[#FF6B00] hover:border-[#FF6B00] transition-all duration-300 shadow-xl group"
        onClick={() => navigate("/")}
      >
        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* --- Hero Header Section --- */}
      {shop && (
        <div className='relative w-full h-[400px] md:h-[500px] animate-slideUp'>
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
             <img src={shop.image} alt={shop.name} className='w-full h-full object-cover scale-105 blur-[2px] opacity-60'/>
             <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent"></div>
          </div>

          {/* Shop Details Card */}
          <div className='absolute bottom-0 left-0 w-full p-6 md:p-12 flex justify-center'>
             <div className="max-w-4xl w-full bg-[#1F1F1F]/80 backdrop-blur-xl border border-[#333] rounded-[40px] p-8 md:p-10 shadow-2xl flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 transform translate-y-16">
                
                {/* --- SHOP ICON --- */}
                <div className="relative group -mt-20 md:-mt-0 md:-ml-10 z-10 cursor-default">
                    <div className="absolute inset-0 bg-[#FF6B00] rounded-full blur-[30px] opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                    <div className="relative w-24 h-24 md:w-32 md:h-32 bg-[#0D0D0D] rounded-full border-4 border-[#FF6B00] flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(255,107,0,0.4)]">
                        <FaStore className='text-[#FF6B00] text-4xl md:text-5xl drop-shadow-md'/>
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h1 className='text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg'>{shop.name}</h1>
                    
                    <div className='flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-300 text-sm md:text-base'>
                        <div className="flex items-center gap-2">
                            <FaLocationDot className="text-[#FF6B00]" />
                            <span>{shop.address}, {shop.city}</span>
                        </div>
                        <span className="hidden md:inline text-gray-600">•</span>
                        <div className="flex items-center gap-1 text-yellow-400">
                            <FaStar /> <span className="font-bold text-white">4.5</span> <span className="text-gray-500">(200+ Ratings)</span>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block">
                    {/* Status Badge: Open or Not Deliverable */}
                    {isDeliverable ? (
                        <div className="bg-[#FF6B00]/10 border border-[#FF6B00] text-[#FF6B00] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
                            Open Now
                        </div>
                    ) : (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                            Not Deliverable Here
                        </div>
                    )}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- Menu Section --- */}
      <div className='max-w-[1400px] mx-auto px-6 pt-24 pb-20'>
        
        {/* Section Title */}
        <div className="flex items-center gap-4 mb-12 animate-slideUp" style={{animationDelay: '100ms'}}>
            <div className="h-10 w-1 bg-[#FF6B00] rounded-full"></div>
            <h2 className='text-3xl font-bold text-white flex items-center gap-3'>
                <FaUtensils className="text-[#FF6B00] opacity-80" /> 
                Our Menu
            </h2>
        </div>

        {items.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center sm:justify-items-start'>
            {items.map((item, index) => (
                <div key={item._id} className="relative group animate-slideUp" style={{animationDelay: `${index * 100}ms`}}>
                    
                    {/* --- NOT DELIVERABLE OVERLAY --- */}
                    {!isDeliverable && (
                        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-[20px] flex flex-col items-center justify-center text-center p-4 cursor-not-allowed">
                            {/* FIXED: Replaced FaMapMarkerAlt with FaLocationDot */}
                            <FaLocationDot className="text-[#FF6B00] text-3xl mb-2" />
                            <p className="text-white font-bold text-lg">Not Deliverable</p>
                            <p className="text-gray-300 text-xs mt-1">
                                This shop is in {shop.city}, but you are in {currentCity}.
                            </p>
                        </div>
                    )}

                    <FoodCard data={item}/>
                </div>
            ))}
            </div>
        ) : (
            <div className='flex flex-col items-center justify-center h-64 text-center opacity-50 animate-fadeIn'>
                <FaUtensils className="text-6xl mb-4 text-gray-600" />
                <p className='text-xl text-gray-400'>No items available at the moment.</p>
            </div>
        )}
      </div>

    </div>
  )
}

export default Shop