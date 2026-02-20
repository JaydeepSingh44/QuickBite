import React, { useState } from 'react';
import { FaLeaf, FaDrumstickBite, FaStar, FaRegStar, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux'
import { addToCard } from '../redux/userSlice';

function FoodCard({ data }) {
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.user)

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className='text-[#FF6B00] text-xs' /> 
        ) : (
          <FaRegStar key={i} className='text-gray-600 text-xs' />
        )
      );
    }
    return stars;
  };

  return (
    // Main Card: #1F1F1F (Dark Charcoal), Rounded 20px, Shadow
    <div className='w-[280px] rounded-[20px] bg-[#1F1F1F] p-4 shadow-lg shadow-black/40 border border-[#333] hover:border-[#FF6B00]/30 hover:shadow-[#FF6B00]/10 transition-all duration-300 flex flex-col gap-4 group'>
      
      {/* Image Section */}
      <div className='relative w-full h-[180px] rounded-[16px] overflow-hidden bg-black'>
        <div className='absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-full p-2 z-10 shadow-sm'>
          {data.foodType === 'veg' ? (
            <FaLeaf className='text-green-500 text-xs' />
          ) : (
            <FaDrumstickBite className='text-red-500 text-xs' />
          )}
        </div>
        <img
          src={data.image}
          alt=''
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100'
        />
      </div>

      {/* Content Section */}
      <div className='flex flex-col gap-1'>
        {/* Title */}
        <h1 className='font-bold text-white text-xl tracking-wide truncate'>{data.name}</h1>
        
        {/* Stars and Reviews */}
        <div className='flex items-center gap-2'>
          <div className='flex gap-1'>
            {renderStars(data.rating?.average || 0)}
          </div>
          <span className='text-xs text-[#A1A1A1]'>
            ({data.rating?.count || 0} reviews)
          </span>
        </div>
      </div>

      {/* Footer: Price + Controls */}
      <div className='flex items-center justify-between mt-auto pt-2 border-t border-[#333]'>
        
        {/* Price - Bold Orange */}
        <span className='font-bold text-[#FF6B00] text-2xl'>
          ₹{data.price}
        </span>

        <div className='flex items-center gap-3'>
            {/* Counter Pill - Very Dark Background */}
            <div className='flex items-center gap-3 bg-[#0D0D0D] rounded-full px-4 py-2 border border-[#333]'>
                <button className='text-[#A1A1A1] hover:text-white transition text-xs' onClick={handleDecrease}>
                    <FaMinus size={10} />
                </button>
                
                <span className='text-white text-base font-bold w-3 text-center'>{quantity}</span>
                
                <button className='text-[#A1A1A1] hover:text-white transition text-xs' onClick={handleIncrease}>
                    <FaPlus size={10} />
                </button>
            </div>

            {/* Cart Button */}
            <button 
                className={`${cartItems.some(i => i.id === data._id) ? "bg-gray-700 cursor-not-allowed" : "bg-[#FF6B00] hover:bg-[#ff8e26] hover:scale-105 hover:shadow-lg hover:shadow-[#FF6B00]/40"} 
                text-white w-10 h-10 flex justify-center items-center rounded-full transition-all duration-300 active:scale-95`}
                onClick={() => {
                quantity > 0 ? dispatch(addToCard({
                    id: data._id,
                    name: data.name,
                    price: data.price,
                    image: data.image,
                    shop: data.shop,
                    quantity,
                    foodType: data.foodType
                })) : null
                }}
            >
                <FaShoppingCart size={16} />
            </button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;