import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaCloudUploadAlt } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';

function AddItem() {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [category, setCategory] = useState("")
    const [foodType, setFoodType] = useState("veg")
    
    const categories = ["Snacks", "Main Course", "Dessert", "Pizza", "Burgers", "Sandwiches", "South Indian", "Chinese", "Rajasthani", "Fast Food", "Others"]
    const dispatch = useDispatch()

    const handleImage = (e) => {
        const file = e.target.files[0]
        if (file) {
            setBackendImage(file)
            setFrontendImage(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("category", category)
            formData.append("foodType", foodType)
            formData.append("price", price)
            if (backendImage) {
                formData.append("image", backendImage)
            }
            const result = await axios.post(`${serverUrl}/api/item/add-item`, formData, { withCredentials: true })
            dispatch(setMyShopData(result.data))
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='min-h-screen bg-[#0D0D0D] flex justify-center items-center p-4 animate-fadeIn'>
            
            {/* Back Button */}
            <div 
                className='absolute top-6 left-6 z-[10] w-12 h-12 rounded-full bg-[#1F1F1F] flex items-center justify-center cursor-pointer hover:bg-[#FF6B00] group transition-all duration-300 shadow-lg border border-[#333]' 
                onClick={() => navigate("/")}
            >
                <IoIosArrowRoundBack size={30} className='text-[#FF6B00] group-hover:text-white transition-colors' />
            </div>

            <div className="max-w-lg w-full bg-[#1F1F1F] shadow-2xl shadow-black/50 rounded-[30px] p-8 border border-[#333] animate-slideUp">
                
                <div className='flex flex-col items-center mb-8'>
                    <div className="w-20 h-20 bg-[#0D0D0D] rounded-full flex items-center justify-center border border-[#333] mb-4 shadow-inner">
                        <FaUtensils className='text-[#FF6B00] w-8 h-8' />
                    </div>
                    <div className='text-3xl font-extrabold text-white tracking-wide'>
                        Add New Item
                    </div>
                    <p className='text-gray-500 text-sm mt-1'>Expand your menu with delicious food</p>
                </div>

                <form className='space-y-5' onSubmit={handleSubmit}>
                    
                    {/* Name Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Item Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Spicy Paneer Wrap" 
                            className="w-full bg-[#0D0D0D] border border-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all placeholder-gray-600"
                            onChange={(e) => setName(e.target.value)} 
                            value={name}
                            required 
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Food Image</label>
                        <div className="relative w-full">
                            <input type="file" id="food-img" className="hidden" onChange={handleImage} />
                            <label htmlFor="food-img" className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#333] rounded-xl cursor-pointer hover:border-[#FF6B00] hover:bg-[#FF6B00]/5 transition-all bg-[#0D0D0D]">
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

                    {/* Price Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Price (₹)</label>
                        <input 
                            type="number" 
                            placeholder="0" 
                            className="w-full bg-[#0D0D0D] border border-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all placeholder-gray-600"
                            onChange={(e) => setPrice(e.target.value)} 
                            value={price}
                            required 
                        />
                    </div>

                    {/* Category & Type Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className='block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide'>Category</label>
                            <select 
                                className='w-full bg-[#0D0D0D] border border-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B00] cursor-pointer appearance-none'
                                onChange={(e) => setCategory(e.target.value)} 
                                value={category}
                                required
                            >
                                <option value="" className="text-gray-500">Select...</option>
                                {categories.map((cate, index) => (
                                    <option value={cate} key={index}>{cate}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className='block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide'>Food Type</label>
                            <select 
                                className='w-full bg-[#0D0D0D] border border-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B00] cursor-pointer appearance-none'
                                onChange={(e) => setFoodType(e.target.value)} 
                                value={foodType}
                            >
                                <option value="veg">Veg</option>
                                <option value="non-veg">Non-Veg</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8E26] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#FF6B00]/20 hover:shadow-[#FF6B00]/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 mt-4">
                        Add Item to Menu
                    </button>
                </form>

            </div>
        </div>
    )
}

export default AddItem