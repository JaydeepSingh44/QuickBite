import React, { useState } from 'react';
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";


function FoodCard({ data }) {
    const [quantity,setQuentity] = useState(0)
    const renderStars=(rating)=>{
        const stars=[];
        for(let i=1;i<=5; i++){
            stars.push(
                (i<=rating)?(
                    <FaStar className='text-yellow-600 text-lg'/>
                ):<FaRegStar className='text-yellow-600 text-lg' />

            )
        }
        return stars
    }
  return (
    <div className='w-[250px] rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col'>
      <div className='relative w-full h-[170px] flex justify-center items-center bg-white'>
        <div className='absolute top-3 right-3 bg-white rounded-full p-1 shadow'>
           {data.foodType=="veg"?<FaLeaf  className='text-green-600 text-lg'
           />:<FaDrumstickBite   className='text-red-600 text-lg'/>}
        </div>
        <img
          src={data.image}
          alt=''
          className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
        />
      </div>

      <div className='flex-1 flex flex-col p-4'>
        <h1 className='font-semibold text-gray-900 text-base truncate'>{data.name}</h1>
        <div className='flex items-center gap-1 mt-1'>
         {renderStars(data.rating?.average || 0)}
         <span className='ml-2 text-sm text-gray-700'>
            {data.rating?.count || 0}
         </span>
        </div>
      </div>
        
      <div className='flex items-center justify-between mt-auto pt-3'>
  <span className='font-bold text-gray-900 text-lg pl-3'>
    {data.price}
  </span>
  <div className='flex items-center border rounded-full overflow-hidden shadow-sm mr-2'>
    <button className='px-2 py-1 hover:bg-gray-100 transition'>
      <FaMinus size={10}/>
    </button>

    <span>{quantity}</span>

    <button className='px-2 py-1 hover:bg-gray-100 transition'>
      <FaPlus size={10}/>
    </button>

  </div>
</div>


       
    </div>
  );
}

export default FoodCard;