import React, { useState, useEffect, useRef } from 'react'
import axios from "axios"
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { RxCross2 } from "react-icons/rx";
import { serverUrl } from '../App';
import { setSearchItems, setUserData } from '../redux/userSlice';
import { FaPlus } from "react-icons/fa";
import { TbReceipt2 } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

function Nav() {
    const {userData, currentCity, cartItems } = useSelector(state=>state.user)
    const {myShopData} = useSelector(state=>state.owner)

    const [showInfo,setShowInfo] = useState(false)
    const [showSearch , setShowSearch] = useState(false);
    const dispatch=useDispatch()
    const[query,setQuery]=useState("")
    const navigate = useNavigate()
    
    // CHANGED: Create a Ref to track the profile dropdown container
    const profileRef = useRef(null);

    const handleLogOut = async () =>{
      try {
        const result= await axios.get(`${serverUrl}/api/auth/signout`,{withCredentials:true})
        dispatch(setUserData(null))
      } catch (error) {
        console.log(error)
      }
    }

    const handleSearchItems = async (query) => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`,
          { withCredentials: true }
        )
        dispatch(setSearchItems(result.data))
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=>{
      if(query){
        handleSearchItems(query)
      }else{
        dispatch(setSearchItems(null))
      }
    },[query])

    // CHANGED: Add this useEffect to handle clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // If the menu is open AND the click is NOT inside the profileRef element
            if (showInfo && profileRef.current && !profileRef.current.contains(event.target)) {
                setShowInfo(false);
            }
        };

        // Add event listener
        document.addEventListener("mousedown", handleClickOutside);

        // Clean up listener on unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showInfo]); // Re-run if showInfo changes

  return (
    // Main Navbar - Added transition-all
    <div className='w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-[#0D0D0D] border-b border-gray-800 shadow-lg shadow-black/50 overflow-visible transition-all duration-300'>

      {/* ... (Search Logic for Mobile kept same) ... */}
      {showSearch && userData.role=="user" &&  
        <div className='w-[90%] h-[60px] bg-[#1F1F1F] border border-gray-700 shadow-2xl rounded-full items-center gap-[15px] flex fixed top-[90px] left-[5%] z-50 px-4 transition-all duration-300 animate-slideUp origin-top'>
          <div className='flex items-center w-[30%] overflow-hidden gap-[8px] px-[5px] border-r border-gray-600'>
            <FaLocationDot size={20} className='text-[#FF6B00]' />
            <div className='w-[80%] truncate text-gray-300 text-sm'>{currentCity}</div>
          </div>
          <div className="w-[80%] flex items-center gap-[10px]">
            <IoIosSearch size={22} className="text-[#FF6B00]" onClick={()=>setShowSearch(true)} />
            <input type="text" placeholder="Search..." className="bg-transparent text-white placeholder-gray-500 outline-none w-full text-sm" 
             onChange={(e)=>setQuery(e.target.value)} value={query}/>
          </div>
        </div>
      }

      <h1 className='text-3xl font-extrabold mb-1 text-[#FF6B00] tracking-wider cursor-pointer hover:text-white transition-colors duration-300'>
        QuickBite
      </h1>

      {/* ... (Desktop Search Logic kept same) ... */}
      {userData.role == "user" &&  
        <div className='md:w-[60%] lg:w-[40%] h-[55px] bg-[#1F1F1F] border border-gray-800 shadow-inner rounded-full items-center gap-[15px] hidden md:flex px-5 hover:border-[#FF6B00]/50 transition-all duration-300 focus-within:shadow-[0_0_10px_rgba(255,107,0,0.2)]'>
          <div className='flex items-center w-[30%] overflow-hidden gap-[10px] px-[5px] border-r border-gray-600'>
            <FaLocationDot size={20} className='text-[#FF6B00]' />
            <div className='w-[80%] truncate text-gray-300 font-medium'>{currentCity}</div>
          </div>
          <div className="w-[80%] flex items-center gap-[10px]">
            <IoIosSearch size={24} className="text-[#FF6B00]" />
            <input type="text" placeholder="Search delicious food..." className="bg-transparent text-white placeholder-gray-500 outline-none w-full font-light" 
            onChange={(e)=>setQuery(e.target.value)} value={query}/>
          </div>
        </div> 
      }

     <div className='flex items-center gap-6'>

      {/* ... (Search Toggle Icons kept same) ... */}
      {userData.role == "user" && (
        showSearch ? 
        <RxCross2 size={25} className="text-[#FF6B00] md:hidden cursor-pointer hover:rotate-90 transition-transform duration-300" onClick={()=>setShowSearch(false)}/> : 
        <IoIosSearch size={25} className="text-[#FF6B00] md:hidden cursor-pointer hover:scale-110 transition-transform duration-300" onClick={()=>setShowSearch(true)}/>
      )}
      

      {userData.role == "owner" ? <>
      {myShopData && <>
          <button className='hidden md:flex items-center gap-2 px-4 py-2 cursor-pointer rounded-full
           bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white transition-all duration-300 active:scale-95' onClick={()=>navigate("/add-item")}>
               <FaPlus size={16} />
               <span className='font-medium'>Add Item</span>
           </button>
            <button className='md:hidden flex items-center p-2 cursor-pointer rounded-full
           bg-[#FF6B00]/10 text-[#FF6B00] active:scale-95 transition-transform' onClick={()=>navigate("/add-item")}>
               <FaPlus size={20} />     
           </button>
        </>}
           <div className='hidden md:flex items-center gap-2 cursor-pointer relative px-4 py-2 rounded-full bg-[#1F1F1F] border border-gray-700 
           text-gray-300 hover:text-[#FF6B00] hover:border-[#FF6B00] transition-all duration-300 active:scale-95' onClick={()=>navigate("/my-orders")}>
               <TbReceipt2 size={20}/>
               <span className='font-medium'>Orders</span>
               <span className="absolute -right-1 -top-1 text-[10px] font-bold text-white bg-[#FF6B00]
                rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#0D0D0D]">0</span>
           </div>

           <div className='md:hidden flex items-center gap-2 cursor-pointer relative px-2 py-2 rounded-lg
           text-[#FF6B00] active:scale-95 transition-transform' onClick={()=>navigate("/my-orders")}>
               <TbReceipt2 size={28}/>
               <span className="absolute -right-1 -top-1 text-[10px] font-bold text-white bg-[#FF6B00]
                rounded-full w-4 h-4 flex items-center justify-center">0</span>
           </div>
      
          </> :(
               <>
               {userData.role=="user" && 
                <div className='relative cursor-pointer group transition-transform active:scale-95' onClick={()=>navigate("/cart")} > 
                  <FiShoppingCart size={26} className='text-gray-300 group-hover:text-[#FF6B00] transition-colors duration-300' />
                  {cartItems.length > 0 && 
                    <span className='absolute -right-2 -top-2 bg-[#FF6B00] text-white text-[10px] font-bold 
                    rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#0D0D0D] animate-bounce'>
                      {cartItems.length}
                    </span>
                  }
                </div>
               }
                  
               <button className="hidden md:block px-4 py-2 rounded-full bg-[#1F1F1F] text-gray-300 text-sm font-medium hover:bg-[#FF6B00] hover:text-white transition-all duration-300 active:scale-95" onClick={()=>navigate("/my-orders")}>
                 My Orders
               </button>
               </>
          )}

           {/* CHANGED: Wrapped Avatar and Dropdown in a div with the ref */}
           <div ref={profileRef} className='relative'>
                {/* User Avatar */}
                <div className='w-[40px] h-[40px] rounded-full flex items-center justify-center bg-gradient-to-tr from-[#FF6B00] to-[#ff9e5e]
                    text-white text-[18px] shadow-lg shadow-[#FF6B00]/20 font-bold cursor-pointer hover:scale-105 transition-transform duration-300 border-2 border-[#0D0D0D]' 
                    onClick={()=>setShowInfo(prev=>!prev)}>
                    {userData?.fullName.slice(0,1)}
                </div>

                {/* Dropdown Menu - Added animate-fadeIn */}
                {showInfo && 
                <div className ={`fixed top-[85px] right-[20px] ${userData.role=="deliveryBoy"?"md:right-[20%] lg:right-[40%]":"md:right-[15%] lg:right-[10%]" } w-[200px] bg-[#1F1F1F] border border-gray-700
                    shadow-2xl shadow-black rounded-xl p-[15px] flex flex-col gap-[10px] z-[9999] animate-fadeIn origin-top-right`}>
                    
                    <div className='text-white font-semibold border-b border-gray-700 pb-2'>{userData.fullName}</div>
                    
                    {userData.role=="user"&& (
                        <div className='md:hidden text-gray-400 hover:text-[#FF6B00] font-medium cursor-pointer transition-colors duration-200'
                        onClick={()=>navigate("/my-orders")}>My Orders</div>
                    )}
                    
                    <div className='text-[#FF6B00] hover:text-white font-semibold cursor-pointer transition-colors duration-200 pt-1' onClick={handleLogOut}>
                    Log Out
                    </div>
                </div>}
            </div> 
            {/* End of Wrapped Div */}

      </div>
    </div>
  )
}

export default Nav