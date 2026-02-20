import React from 'react'
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";

function OwnerItemCard({data}) {
    const navigate = useNavigate()
    const dispatch = useDispatch()

   const handleDelete = async () => {
      if(window.confirm("Are you sure you want to delete this item?")) {
          try {
            const result = await axios.delete(`${serverUrl}/api/item/delete/${data._id}`,
              { withCredentials: true }
            );
            dispatch(setMyShopData(result.data));
          } catch (error) {
            console.log("Delete item error:", error);
          }
      }
    };

  return (
  <div className='flex bg-[#1F1F1F] rounded-[20px] shadow-lg shadow-black/20 overflow-hidden border border-[#333] hover:border-[#FF6B00]/50 transition-all duration-300 w-full group'>
    
    {/* Image Section */}
    <div className='w-32 sm:w-40 bg-[#0D0D0D] relative overflow-hidden'>
      <img 
        src={data.image} 
        alt='' 
        className='w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500'
      />
    </div>

    {/* Content Section */}
    <div className='flex flex-col justify-between p-4 flex-1'>
      <div className="space-y-1">
        <h2 className='text-lg font-bold text-white group-hover:text-[#FF6B00] transition-colors line-clamp-1'>{data.name}</h2>
        <div className="flex flex-wrap gap-2 text-xs">
             <span className="bg-[#262626] text-gray-400 px-2 py-1 rounded-md border border-[#333]">{data.category}</span>
             <span className={`px-2 py-1 rounded-md border border-[#333] font-medium ${data.foodType === 'veg' ? 'text-green-500 bg-green-900/10' : 'text-red-500 bg-red-900/10'}`}>
                {data.foodType}
             </span>
        </div>
      </div>

      <div className='flex items-end justify-between mt-3'>
        <div className='text-[#FF6B00] font-extrabold text-xl'>₹{data.price}</div>
        
        <div className='flex items-center gap-3'>
            <button 
                className='w-9 h-9 flex items-center justify-center rounded-xl bg-[#262626] text-gray-400 border border-[#333] hover:bg-[#FF6B00] hover:text-white hover:border-[#FF6B00] transition-all'
                onClick={()=>navigate(`/edit-item/${data._id}`)}
                title="Edit Item"
            >
                <FaPen size={14}/>
            </button>
            <button 
                className='w-9 h-9 flex items-center justify-center rounded-xl bg-[#262626] text-gray-400 border border-[#333] hover:bg-red-600 hover:text-white hover:border-red-600 transition-all'
                onClick={handleDelete}
                title="Delete Item"
            >
                <FaTrashAlt size={14}/>
            </button>
        </div>
      </div>
    </div>
  </div>
);
}

export default OwnerItemCard