import React from 'react'

function CategoryCard({ name,image,onClick }) {
  return (
    // Dark #1F1F1F, removed border, added subtle glow on hover
    <div className='w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-[30px] 
    bg-[#1F1F1F] shrink-0 overflow-hidden shadow-lg shadow-black/40 border border-[#333]
    cursor-pointer group relative transition-all duration-300 hover:scale-105 hover:border-[#FF6B00]/50 hover:shadow-[#FF6B00]/20' onClick={onClick}>
      
      <img
        src={image}
        alt=""
        className='w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110'
      />
      
      {/* Dark Gradient Overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent'></div>

      <div className='absolute bottom-0 w-full left-0 px-3 py-3 text-center'>
        <p className='text-sm md:text-base font-bold text-gray-200 group-hover:text-[#FF6B00] drop-shadow-md truncate transition-colors'>
          {name}
        </p>
      </div>
    </div>
  );
}

export default CategoryCard