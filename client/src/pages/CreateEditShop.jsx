import React, { useRef, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaStore, FaCloudUploadAlt } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';

function CreateEditShop() {
    const navigate = useNavigate()
    const {myShopData}=useSelector(state=>state.owner)
    const {currentCity,currentState ,currentAddress}=useSelector(state=>state.user)
    const [name,setName] = useState(myShopData?.name || "")
    const [address,setAddress] = useState(myShopData?.address || currentAddress)
    const [City,setCity] = useState(myShopData?.city || currentCity)
    const [state,setState] = useState(myShopData?.state || currentState)
    const [frontendImage,setFrontendImage] = useState(myShopData?.image || null)
    const[backendImage , setBackendImage]= useState(null)
    const dispatch = useDispatch()


    const handleImage=(e)=>{
        const file= e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append("name",name)
            formData.append("city",City)
            formData.append("state",state)
            formData.append("address",address)
            if(backendImage){
                formData.append("image",backendImage)
            }
            const result= await axios.post(`${serverUrl}/api/shop/create-edit`,formData,
                {withCredentials:true})
            dispatch(setMyShopData(result.data))
            
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }
    
  return (
    <div className='min-h-screen bg-[#0D0D0D] flex justify-center items-center p-4 animate-fadeIn'>
       
       <div 
        className='absolute top-6 left-6 z-[10] w-12 h-12 rounded-full bg-[#1F1F1F] flex items-center justify-center cursor-pointer hover:bg-[#FF6B00] group transition-all duration-300 shadow-lg' 
        onClick={()=>navigate("/")}>
         <IoIosArrowRoundBack size={30} className='text-[#FF6B00] group-hover:text-white transition-colors'/>
        </div>

        <div className="max-w-xl w-full bg-[#1F1F1F] shadow-2xl shadow-black/50 rounded-[30px] p-8 border border-[#333] animate-slideUp">

            <div className='flex flex-col items-center mb-8'>
                <div className="w-16 h-16 bg-[#0D0D0D] rounded-full flex items-center justify-center border border-[#333] mb-4">
                   <FaStore className='text-[#FF6B00] w-7 h-7'/>
                </div>
                <div className='text-2xl font-bold text-white'>
                    {myShopData ? "Edit Restaurant" : "Add Restaurant"}
                </div>
                <p className="text-gray-500 text-sm mt-1">Fill in the details below</p>
            </div>

            <form className='space-y-5' onSubmit={handleSubmit}>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Restaurant Name</label>
                    <input type="text" placeholder="e.g. Tasty Bites" 
                        className="w-full bg-[#0D0D0D] border border-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all placeholder-gray-600"
                        onChange={(e)=>setName(e.target.value)} value={name} required
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Cover Image</label>
                    <div className="relative w-full">
                        <input type="file" id="shop-img" className="hidden" onChange={handleImage}/>
                        <label htmlFor="shop-img" className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#333] rounded-xl cursor-pointer hover:border-[#FF6B00] hover:bg-[#FF6B00]/5 transition-all">
                            {frontendImage ? (
                                <img src={frontendImage} alt="" className='w-full h-48 object-cover rounded-lg shadow-md' />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <FaCloudUploadAlt size={40} className="mx-auto mb-2 text-[#FF6B00]" />
                                    <p>Click to upload image</p>
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">City</label>
                        <input type="text" placeholder="City" 
                            className="w-full bg-[#0D0D0D] border border-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all placeholder-gray-600"
                            onChange={(e)=>setCity(e.target.value)} value={City} required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">State</label>
                        <input type="text" placeholder="State" 
                            className="w-full bg-[#0D0D0D] border border-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all placeholder-gray-600"
                            onChange={(e)=>setState(e.target.value)} value={state} required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Full Address</label>
                    <textarea rows="2" placeholder="Street, Landmark, etc." 
                        className="w-full bg-[#0D0D0D] border border-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all placeholder-gray-600 resize-none"
                        onChange={(e)=>setAddress(e.target.value)} value={address} required
                    />
                </div>

                <button className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8E26] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#FF6B00]/20 hover:shadow-[#FF6B00]/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 mt-4">
                    Save Details
                </button>
            </form>
        </div>
    </div>
  )
}

export default CreateEditShop