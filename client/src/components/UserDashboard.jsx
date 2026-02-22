import React, { useEffect, useRef, useState } from 'react'
import Nav from "./Nav"
import CategoryCard from './CategoryCard';
import { categories } from '../category';
import { FaCircleChevronLeft, FaStoreSlash } from "react-icons/fa6";
import { FaChevronCircleRight, FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import FoodCard from './FoodCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { setExploreData } from '../redux/userSlice';

function UserDashboard() {
   
  const userState = useSelector(state => state.user);
  
  const currentCity = userState?.currentCity;
  const shopInMyCity = userState?.shopInMyCity || [];
  const itemsInMyCity = userState?.itemsInMyCity || [];
  const searchItems = userState?.searchItems || [];
  const exploreShops = userState?.exploreShops || [];
  const exploreItems = userState?.exploreItems || [];
  
  // --- LOADING STATE ---
  const [isLoading, setIsLoading] = useState(true);

  // --- REFS ---
  const cateScrollRef=useRef()
  const shopScrollRef=useRef()
  const exploreCateScrollRef=useRef()
  const exploreShopScrollRef=useRef()
  const observer = useRef(null) 
  
  // --- STATES ---
  const[showLeftCateButton,setShowLeftCateButton]=useState(false)
  const[showRightCateButton,setShowRightCateButton]=useState(false)
  
  const[showLeftShopButton,setShowLeftShopButton]=useState(false)
  const[showRightShopButton,setShowRightShopButton]=useState(false)

  const[showLeftExploreCate, setShowLeftExploreCate] = useState(false)
  const[showRightExploreCate, setShowRightExploreCate] = useState(false)
  const[showLeftExploreShop, setShowLeftExploreShop] = useState(false)
  const[showRightExploreShop, setShowRightExploreShop] = useState(false)

  const[updatedItemsList,setUpdatedItemsList]=useState([])
  const dispatch = useDispatch()
  const navigate=useNavigate()

  // --- 1. HANDLE LOADING & FETCH EXPLORE DATA ---
  useEffect(() => {
    // Delay loading slightly to allow Redux to hydrate or API to respond
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1000); // 1 second buffer

    const fetchExploreData = async () => {
        if (itemsInMyCity?.length === 0 && exploreItems?.length === 0) {
            try {
                const [shopsRes, itemsRes] = await Promise.all([
                    axios.get(`${serverUrl}/api/shop/get-explore`, { withCredentials: true }),
                    axios.get(`${serverUrl}/api/item/get-explore`, { withCredentials: true })
                ]);
                dispatch(setExploreData({ shops: shopsRes.data, items: itemsRes.data }));
            } catch (error) {
                console.error("Error fetching explore data", error);
            }
        }
    };
    
    fetchExploreData();
    return () => clearTimeout(timer);
  }, [itemsInMyCity, exploreItems, dispatch]);

  // --- FILTER LOGIC ---
  const handleFilterByCategory = (category) => {
    const targetList = itemsInMyCity.length > 0 ? itemsInMyCity : exploreItems;
    if (category === "All") {
        setUpdatedItemsList(targetList)
    } else {
        const filteredList = targetList.filter(i => i.category === category)
        setUpdatedItemsList(filteredList)
    }
  }

  useEffect(()=>{
    if(itemsInMyCity.length > 0){
        setUpdatedItemsList(itemsInMyCity)
    } else {
        setUpdatedItemsList(exploreItems)
    }
  },[itemsInMyCity, exploreItems])
  
  // --- HORIZONTAL SCROLL BUTTON LOGIC ---
  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current
    if(element){
      setLeftButton(element.scrollLeft > 0)
      setRightButton(element.scrollLeft + element.clientWidth < element.scrollWidth - 1)
    }
  }

  const scrollHandler = (ref, direction, updateFn) => {
    if(ref.current){
      ref.current.scrollBy({
        left: direction === "left" ? -250 : 250,
        behavior: "smooth"
      })
      setTimeout(() => {
        if(updateFn) updateFn(); 
      }, 350);
    }
  }

  // Attach Scroll Listeners
  useEffect(() => {
    const refs = [
        { ref: cateScrollRef, setL: setShowLeftCateButton, setR: setShowRightCateButton },
        { ref: shopScrollRef, setL: setShowLeftShopButton, setR: setShowRightShopButton },
        { ref: exploreCateScrollRef, setL: setShowLeftExploreCate, setR: setShowRightExploreCate },
        { ref: exploreShopScrollRef, setL: setShowLeftExploreShop, setR: setShowRightExploreShop }
    ];

    refs.forEach(({ref, setL, setR}) => {
        const el = ref.current;
        if(el) {
            updateButton(ref, setL, setR); 
            const handler = () => updateButton(ref, setL, setR);
            el.addEventListener('scroll', handler);
            return () => el.removeEventListener('scroll', handler);
        }
    });
  }, [categories, shopInMyCity, exploreShops]); 

  // --- ANIMATION OBSERVER LOGIC ---
  useEffect(() => {
    const handleScrollAnim = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100');
                entry.target.classList.remove('opacity-0', 'translate-y-10', 'scale-95');
            } 
        });
    };

    observer.current = new IntersectionObserver(handleScrollAnim, {
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px"
    });

    // We only observe once loading is done to ensure elements exist
    if(!isLoading){
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.current.observe(el));
    }

    return () => {
        if (observer.current) observer.current.disconnect();
    }
  }, [isLoading, updatedItemsList, searchItems, categories, shopInMyCity, exploreShops]); 


  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-[#0D0D0D]">
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF6B00]"></div>
            <p className="text-gray-400 text-sm animate-pulse">Finding best food near you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen flex flex-col gap-8 items-center bg-[#0D0D0D] overflow-y-auto pb-10 scroll-smooth'>
      <Nav />
      
      {/* --- Search Results --- */}
      {searchItems && searchItems.length > 0 && (
        <div className='w-full max-w-7xl flex flex-col gap-5 items-start p-5 bg-[#1F1F1F] shadow-lg shadow-black/50 rounded-2xl mt-4 animate-on-scroll opacity-0 translate-y-10 scale-95 transition-all duration-700 ease-out'>
          <h1 className='text-white text-2xl sm:text-3xl font-bold border-b border-gray-700 pb-2 w-full'>
            Search Results
          </h1>
          <div className='w-full h-auto flex flex-wrap gap-6 justify-center'>
            {searchItems.map((item) => (
               <div key={item._id} className="animate-on-scroll opacity-0 translate-y-10 scale-95 transition-all duration-700 ease-out">
                 <FoodCard data={item} />
               </div>
            ))}
          </div>
        </div>
      )}

      {/* --- CONDITIONAL UI --- */}
      {itemsInMyCity.length === 0 ? (
        
        // ================= EXPLORE MODE UI =================
        <div className="w-full max-w-7xl flex flex-col gap-8 mt-4 px-4">
            
            {/* Empty State Message */}
            <div className="bg-[#1F1F1F] border border-[#333] rounded-[30px] p-8 text-center flex flex-col items-center shadow-2xl animate-on-scroll opacity-0 translate-y-10 scale-95 transition-all duration-700 ease-out">
                <FaStoreSlash className="text-[#FF6B00] text-5xl mb-4" />
                <h1 className="text-3xl font-bold text-white mb-2">
                    QuickBite isn't in <span className="text-[#FF6B00]">{currentCity}</span> yet.
                </h1>
                <p className="text-gray-400 max-w-lg mb-6">
                    We are expanding fast! While we get there, explore our top-rated restaurants from Delhi, Noida, Bengaluru, and Pune.
                </p>
                <div className="px-4 py-2 bg-[#FF6B00]/10 border border-[#FF6B00] rounded-full text-[#FF6B00] text-sm font-bold uppercase tracking-widest animate-pulse">
                    Explore Mode Active
                </div>
            </div>

            {/* Categories (Explore Mode) */}
            <div className='w-full flex flex-col gap-5 animate-on-scroll opacity-0 translate-y-10 scale-95 transition-all duration-700 ease-out'>
                <h1 className='text-white text-2xl sm:text-3xl font-bold'>Browse Categories</h1>
                <div className='w-full relative group'>
                    {showLeftExploreCate && (
                        <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#FF6B00] text-white p-3 rounded-full z-10 hover:scale-110 transition-transform' 
                        onClick={() => scrollHandler(exploreCateScrollRef, "left", () => updateButton(exploreCateScrollRef, setShowLeftExploreCate, setShowRightExploreCate))}>
                            <FaCircleChevronLeft size={20} />
                        </button>
                    )}
                    
                    <div className='w-full flex overflow-x-auto gap-6 pb-4 scrollbar-hide' ref={exploreCateScrollRef}>
                        {categories?.map((cate, index) => (
                        <CategoryCard name={cate.category} image={cate.image} key={index} 
                        onClick={()=>handleFilterByCategory(cate.category)}/>
                        ))}
                    </div>

                    {showRightExploreCate && (
                        <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#FF6B00] text-white p-3 rounded-full z-10 hover:scale-110 transition-transform' 
                        onClick={() => scrollHandler(exploreCateScrollRef, "right", () => updateButton(exploreCateScrollRef, setShowLeftExploreCate, setShowRightExploreCate))}>
                            <FaChevronCircleRight size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Explore Shops Section */}
            <div className='w-full flex flex-col gap-5 animate-on-scroll opacity-0 translate-y-10 scale-95 transition-all duration-700 ease-out'>
                <h1 className='text-white text-2xl sm:text-3xl font-bold'>Trending in Major Cities</h1>
                <div className='w-full relative group'>
                    {showLeftExploreShop && (
                        <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#FF6B00] text-white p-3 rounded-full z-10 hover:scale-110 transition-transform' 
                        onClick={()=>scrollHandler(exploreShopScrollRef, "left", () => updateButton(exploreShopScrollRef, setShowLeftExploreShop, setShowRightExploreShop))}>
                            <FaCircleChevronLeft size={20} />
                        </button>
                    )}
                    
                    <div className='w-full flex overflow-x-auto gap-6 pb-4 scrollbar-hide' ref={exploreShopScrollRef}>
                        {exploreShops?.map((shop, index) => (
                        <div key={index} className="relative">
                            <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-md z-10 border border-white/20 shadow-md">
                                {shop.city}
                            </div>
                            <CategoryCard name={shop.name} image={shop.image} 
                            onClick={()=>navigate(`/shop/${shop._id}`)}/>
                        </div>
                        ))}
                    </div>

                    {showRightExploreShop && (
                        <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#FF6B00] text-white p-3 rounded-full z-10 hover:scale-110 transition-transform' 
                        onClick={()=>scrollHandler(exploreShopScrollRef, "right", () => updateButton(exploreShopScrollRef, setShowLeftExploreShop, setShowRightExploreShop))}>
                            <FaChevronCircleRight size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Explore Food Items */}
            <div className='w-full flex flex-col gap-5 pb-10'>
                <h1 className='text-white text-2xl sm:text-3xl font-bold animate-on-scroll opacity-0 translate-y-10 scale-95 transition-all duration-700 ease-out'>Popular Dishes to Explore</h1>
                
                <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center sm:justify-items-start'>
                    {updatedItemsList?.map((item, index) => (
                        <div key={item._id} className="relative group animate-on-scroll opacity-0 translate-y-10 scale-95 transition-all duration-700 ease-out" style={{transitionDelay: `${index*50}ms`}}>
                            <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-[20px] flex flex-col items-center justify-center text-center p-4 cursor-not-allowed">
                                <FaMapMarkerAlt className="text-[#FF6B00] text-3xl mb-2" />
                                <p className="text-white font-bold text-lg">Not Deliverable</p>
                                <p className="text-gray-300 text-xs mt-1">This item is in {item.shop?.city}, outside your area.</p>
                            </div>
                            <FoodCard data={item} />
                        </div>
                    ))}
                </div>
            </div>

        </div>
      ) : (
        
        // ================= NORMAL LOCAL VIEW =================
        <div className="w-full max-w-7xl flex flex-col gap-8 px-4">
            
            {/* Categories Section */}
            <div className='w-full flex flex-col gap-5 items-start animate-on-scroll opacity-0 translate-y-10 scale-95 transition-all duration-700 ease-out'>
                <h1 className='text-white text-2xl sm:text-3xl font-bold'>Inspiration for your first order</h1>
                <div className='w-full relative group'>
                    {showLeftCateButton &&  
                        <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#FF6B00] text-white p-3 rounded-full shadow-lg z-10' 
                        onClick={() => scrollHandler(cateScrollRef, "left", () => updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton))}>
                            <FaCircleChevronLeft size={20} />
                        </button>
                    }
                    <div className='w-full flex overflow-x-auto gap-6 pb-4 scrollbar-hide' ref={cateScrollRef}>
                        {categories?.map((cate, index) => (
                        <CategoryCard name={cate.category} image={cate.image} key={index} onClick={()=>handleFilterByCategory(cate.category)}/>
                        ))}
                    </div>
                    {showRightCateButton && 
                        <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#FF6B00] text-white p-3 rounded-full shadow-lg z-10' 
                        onClick={() => scrollHandler(cateScrollRef, "right", () => updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton))}>
                            <FaChevronCircleRight size={20} />
                        </button>
                    }
                </div>
            </div>

            {/* Shop Section */}
            <div className='w-full flex flex-col gap-5 items-start animate-on-scroll opacity-0 translate-y-10 scale-95 transition-all duration-700 ease-out'>
                <h1 className='text-white text-2xl sm:text-3xl font-bold'>Best Shop in <span className='text-[#FF6B00]'>{currentCity}</span></h1>
                <div className='w-full relative group'>
                    {showLeftShopButton &&  
                        <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#FF6B00] text-white p-3 rounded-full shadow-lg z-10' 
                        onClick={() => scrollHandler(shopScrollRef, "left", () => updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton))}>
                            <FaCircleChevronLeft size={20} />
                        </button>
                    }
                    <div className='w-full flex overflow-x-auto gap-6 pb-4 scrollbar-hide' ref={shopScrollRef}>
                        {shopInMyCity?.map((shop, index) => (
                        <CategoryCard name={shop.name} image={shop.image} key={index} onClick={()=>navigate(`/shop/${shop._id}`)}/>
                        ))}
                    </div>
                    {showRightShopButton && 
                        <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#FF6B00] text-white p-3 rounded-full shadow-lg z-10' 
                        onClick={() => scrollHandler(shopScrollRef, "right", () => updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton))}>
                            <FaChevronCircleRight size={20} />
                        </button>
                    }
                </div>
            </div>
            
            {/* Food Items Section */}
            <div className='w-full flex flex-col gap-5 items-start pb-10'>
                <h1 className='text-white text-2xl sm:text-3xl font-bold animate-on-scroll opacity-0 translate-y-10 scale-95 transition-all duration-700 ease-out'>Suggested Food Items</h1>
                <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center sm:justify-items-start'>
                {updatedItemsList?.map((item, index) => (
                    <div key={item._id} className="animate-on-scroll opacity-0 translate-y-10 scale-95 transition-all duration-700 ease-out" style={{transitionDelay: `${index*50}ms`}}>
                        <FoodCard data={item} />
                    </div>
                ))}
                </div>
            </div> 
        </div>
      )}

    </div>
  );
}
export default UserDashboard
