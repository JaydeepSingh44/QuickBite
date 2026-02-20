import React, { useEffect, useState } from 'react'
import Nav from "./Nav"
import { useSelector } from 'react-redux'
import { FaUtensils, FaPen, FaStore, FaPlus, FaChartLine, FaBoxOpen, FaUsers } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import useGetMyShop from '../hooks/useGetMyShop';
import OwnerItemCard from './OwnerItemCard';

function OwnerDashboard() {
  useGetMyShop();
  const { myShopData } = useSelector(state => state.owner)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [myShopData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex justify-center items-center">
        <div className="relative">
             <div className="w-16 h-16 border-4 border-[#333] border-t-[#FF6B00] rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <FaUtensils className="text-[#FF6B00] text-xl animate-pulse" />
             </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center overflow-x-hidden animate-fadeIn'>
       <Nav/>

       {/* --- EMPTY STATE (No Shop) --- */}
       {!myShopData && !isLoading && (
          <div className='flex-1 flex items-center justify-center w-full px-4 animate-slideUp'>
            <div className='max-w-md w-full bg-[#1F1F1F]/50 backdrop-blur-xl border border-[#333] rounded-[40px] p-10 text-center relative overflow-hidden group'>
              {/* Decorative Blur */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#FF6B00]/20 rounded-full blur-[80px]"></div>
              
              <div className="w-24 h-24 bg-[#0D0D0D] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#333] shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <FaStore className='text-[#FF6B00] w-10 h-10'/>
              </div>
              <h2 className='text-3xl font-extrabold mb-4'>Setup Your Kitchen</h2>
              <p className='text-gray-400 mb-8 leading-relaxed'>
                  Ready to serve? Create your restaurant profile and start receiving orders in minutes.
              </p>
              <button 
                onClick={()=>navigate("/create-edit-shop")}
                className='w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#FF8E26] font-bold text-lg shadow-[0_10px_30px_rgba(255,107,0,0.3)] hover:shadow-[0_15px_40px_rgba(255,107,0,0.5)] hover:-translate-y-1 transition-all duration-300'
              >
                  Create Restaurant
              </button>
            </div>
          </div>
       )}

       {/* --- DASHBOARD CONTENT --- */}
       {myShopData && (
          <div className='w-full max-w-[1400px] px-4 md:px-8 pb-20'>
              
              {/* 1. HERO HEADER SECTION */}
              <div className="relative w-full h-[300px] md:h-[350px] rounded-[40px] overflow-hidden mt-8 mb-12 group animate-slideUp border border-[#333]">
                  {/* Background Image with Overlay */}
                  <img src={myShopData.image} alt="Cover" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/60 to-transparent"></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col md:flex-row justify-between items-end gap-6">
                      <div className="flex-1">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B00]/20 border border-[#FF6B00]/50 text-[#FF6B00] text-xs font-bold uppercase tracking-wider mb-3">
                              <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse"></span> Open for Business
                          </div>
                          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-2xl">{myShopData.name}</h1>
                          <p className="text-gray-300 text-lg flex items-center gap-2">
                             <span className="opacity-60">{myShopData.address}, {myShopData.city}</span>
                          </p>
                      </div>
                      
                      {/* Action Button */}
                      <button 
                        onClick={() => navigate("/create-edit-shop")}
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all active:scale-95"
                      >
                          <FaPen size={14} /> Edit Details
                      </button>
                  </div>
              </div>

              {/* 2. STATS BAR (Mockup Data for Visuals) */}
             

              {/* 3. MENU SECTION */}
              <div className="flex items-center justify-between mb-8 animate-slideUp" style={{animationDelay: '200ms'}}>
                  <div>
                      <h2 className="text-2xl font-bold flex items-center gap-3">
                          Menu Management
                          <span className="text-sm font-normal text-gray-500 bg-[#1F1F1F] px-2 py-1 rounded-lg border border-[#333]">{myShopData.items?.length || 0} Items</span>
                      </h2>
                  </div>
                  <button 
                    onClick={()=>navigate("/add-item")}
                    className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e65c00] text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-[#FF6B00]/20 hover:shadow-[#FF6B00]/40 transition-all hover:-translate-y-1"
                  >
                      <FaPlus /> <span className="hidden sm:inline">Add New Item</span>
                  </button>
              </div>

              {/* 4. ITEMS GRID */}
              {!myShopData.items || myShopData.items.length === 0 ? (
                  <div className="w-full h-64 border-2 border-dashed border-[#333] rounded-[30px] flex flex-col items-center justify-center text-center animate-fadeIn">
                      <FaBoxOpen className="text-[#333] text-5xl mb-4" />
                      <h3 className="text-xl font-bold text-gray-500">Your Menu is Empty</h3>
                      <p className="text-gray-600 mb-4">Start adding delicious food items to sell.</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                      {myShopData.items.map((item, index) => (
                          <div key={item._id} className="animate-slideUp" style={{animationDelay: `${index * 50}ms`}}>
                              <OwnerItemCard data={item} />
                          </div>
                      ))}
                  </div>
              )}

          </div>
       )}
    </div>
  )
}

export default OwnerDashboard