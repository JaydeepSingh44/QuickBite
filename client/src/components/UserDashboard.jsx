import React, { useEffect, useRef, useState } from 'react'
import Nav from "../components/Nav"
import CategoryCard from './CategoryCard';
import { categories } from '../category';
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaChevronCircleRight } from "react-icons/fa";

function UserDashboard() {
  const cateScrollRef=useRef()
  const[showLeftCateButton,setShowLeftCateButton]=useState(false)
  const[showRightCateButton,setShowRightCateButton]=useState(false)
  
  const updateButton = (ref,setLeftButton , setRightButton)=>{
    const element=ref.current
    if(element){
      setLeftButton(element.scrollLeft>0)
      setRightButton(element.scrollLeft+element.clientWidth<element.scrollWidth)
    }
  }

  const scrollHandler = (ref,direction)=>{
    if(ref.current){
      ref.current.scrollBy({
        left:direction=="left"?-200:200,
        behavior: "smooth"
      })
      setTimeout(() => {
        updateButton(ref, setShowLeftCateButton, setShowRightCateButton);
      }, 300);

    }
  }

  useEffect(() => {
    const el = cateScrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton);
    };

    // Run once to set initial button visibility
    handleScroll();

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);



  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <Nav />
      {/* Div to show items  */}
      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
        <h1 className='text-gray-800 text-2xl sm:text-3xl'>Inspiration for your first order</h1>
        <div className='w-full relative'>

          {showLeftCateButton &&  <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] 
          text-white p-2 rounded-full shadow-lg 
          hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(cateScrollRef,"left")}>
             <FaCircleChevronLeft />
          </button>}
         
          <div className='w-full flex overflow-x-auto gap-4 pb-2' ref={cateScrollRef}>
            {categories.map((cate, index) => (
              <CategoryCard data={cate} key={index} />
            ))}
          </div>

          {showRightCateButton && <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] 
          text-white p-2 rounded-full shadow-lg 
          hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(cateScrollRef,"right")}>
             <FaChevronCircleRight />
          </button>}
          
        </div>


      </div>


    </div>
  );
}

export default UserDashboard