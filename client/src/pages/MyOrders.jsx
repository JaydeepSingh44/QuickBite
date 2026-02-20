import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import OwnerOrderCard from '../components/OwnerOrderCard';
import UserOrderCard from '../components/UserOrderCard';
import { setMyOrders } from '../redux/userSlice';
import { socket } from "../socket"

function MyOrders() {
    const {userData, myOrders} = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const observer = useRef(null)

    useEffect(() => {
        if (!socket || !userData) return
        const handleNewOrder = (data) => {
            dispatch(setMyOrders([data, ...myOrders]))
        }
        socket.on("newOrder", handleNewOrder)
        return () => {
            socket.off("newOrder", handleNewOrder)
        }
    }, [userData, myOrders])

    // --- SCROLL ANIMATION LOGIC (Runs every time elements change or scroll) ---
    useEffect(() => {
        const handleScroll = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100');
                    entry.target.classList.remove('opacity-0', 'translate-y-10', 'scale-95');
                } else {
                    // Remove these lines if you want the animation to happen ONLY ONCE
                    // Keep them if you want it to animate OUT and IN every time you scroll
                    entry.target.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
                    entry.target.classList.add('opacity-0', 'translate-y-10', 'scale-95');
                }
            });
        };

        observer.current = new IntersectionObserver(handleScroll, {
            threshold: 0.1, // Trigger when 10% of card is visible
            rootMargin: "0px 0px -50px 0px" // Offset slightly from bottom
        });

        const cards = document.querySelectorAll('.order-card');
        cards.forEach(card => observer.current.observe(card));

        return () => {
            if (observer.current) observer.current.disconnect();
        }
    }, [myOrders]);

  return (
    // Main Container: Deep Black
    <div className='w-full min-h-screen bg-[#0D0D0D] flex flex-col items-center pt-10 pb-10 px-4 sm:px-8'>
        
        <div className='w-full max-w-7xl'>
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-10 border-b border-[#262626] pb-6">
                <div className="cursor-pointer p-2 rounded-full hover:bg-[#1F1F1F] transition-all group" onClick={() => navigate("/")}>
                    <IoIosArrowRoundBack size={40} className="text-[#FF6B00] group-hover:-translate-x-1 transition-transform" />
                </div>
                <div>
                    <h1 className='text-3xl font-bold text-white tracking-wide'>My Orders</h1>
                    <p className='text-gray-500 text-sm mt-1'>Track and manage your recent purchases</p>
                </div>
            </div>

            {/* Grid Layout for PC (1 col mobile, 2 cols lg, 3 cols xl) */}
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8'>
                {myOrders?.map((order, index)=>(
                  userData.role === "user" ? (
                       <div key={index} className="order-card opacity-0 translate-y-10 scale-95 transition-all duration-700 ease-out will-change-transform">
                           <UserOrderCard data={order}/>
                       </div>
                    )
                     : userData.role === "owner" ? (
                        <div key={index} className="order-card opacity-0 translate-y-10 scale-95 transition-all duration-700 ease-out will-change-transform">
                           <OwnerOrderCard data={order}/>
                        </div>
                    )
                        : null
                    ))}
            </div>

            {myOrders?.length === 0 && (
                <div className='text-center text-gray-500 mt-20'>
                    <p>No orders found yet.</p>
                </div>
            )}

        </div>
    </div>
  )
}

export default MyOrders