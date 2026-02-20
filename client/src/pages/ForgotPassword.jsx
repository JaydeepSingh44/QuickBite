import axios from 'axios';
import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaEnvelope, FaKey, FaLock } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';

function ForgotPassword() {
    const [step,setStep]=useState(1);
    const[email, setEmail] = useState("")
    const navigate=useNavigate();
    const [otp, setOtp] = useState("")
    const[newPassword, setNewPassword] = useState("");
    const[confirmPassword, setConfirmPassword]= useState("");
    const[err,setErr] = useState("")
    const[loading,setLoading] = useState(false)
    
    
    const handleSendOtp=async() =>{
        setLoading(true);
        try{
            const result = await axios.post(`${serverUrl}/api/auth/send-otp`,{email}, {withCredentials:true})
            setErr("");
            setStep(2);
        }catch(error){
            setErr(error?.response?.data?.message);
        }finally{
            setLoading(false);
        }
    }

    const handleVerifyOtp=async() =>{
        setLoading(true);
        try{
            const result = await axios.post(`${serverUrl}/api/auth/verify-otp`,{email,otp}, {withCredentials:true})
            setErr("")
            setStep(3);
        }catch(error){
            setErr(error?.response?.data?.message);
        }finally{
            setLoading(false);
        }
    }

    const handleResetPassword=async() =>{
        if(newPassword !== confirmPassword){
            setErr("Passwords do not match");
            return;
        }
        setLoading(true);
        try{
            const result = await axios.post(`${serverUrl}/api/auth/reset-password`,{email,newPassword}, {withCredentials:true})
            setErr("")
            navigate("/signin");
        }catch(error){
            setErr(error?.response?.data?.message);
        }finally{
            setLoading(false);
        }
    }

  return (
    <div className='min-h-screen w-full bg-[#0D0D0D] flex items-center justify-center p-6 animate-fadeIn'>
      
      <div className='bg-[#1F1F1F] rounded-[30px] shadow-2xl shadow-black/50 w-full max-w-md p-8 border border-[#333] relative overflow-hidden animate-slideUp'>
        
        {/* Background Blur Blob */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF6B00]/10 rounded-full blur-[60px] pointer-events-none"></div>

        {/* --- Header --- */}
        <div className='flex items-center gap-4 mb-8'>
            <div 
                onClick={()=>navigate("/signin")}
                className="w-10 h-10 rounded-full bg-[#0D0D0D] flex items-center justify-center border border-[#333] cursor-pointer hover:bg-[#FF6B00] hover:text-white hover:border-[#FF6B00] transition-all group"
            >
                <IoIosArrowRoundBack size={24} className='text-[#FF6B00] group-hover:text-white transition-colors'/>
            </div>
            <h1 className='text-2xl font-bold text-white tracking-wide'>Reset Password</h1>
        </div>

        {/* --- Step Indicators --- */}
        <div className="flex justify-between items-center mb-10 px-2 relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#333] -z-10"></div>
            {[1, 2, 3].map((s) => (
                <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 z-10 
                    ${step >= s ? 'bg-[#FF6B00] text-white shadow-[0_0_10px_#FF6B00]' : 'bg-[#0D0D0D] text-gray-500 border border-[#333]'}`}>
                    {step > s ? '✓' : s}
                </div>
            ))}
        </div>

        {/* --- STEP 1: EMAIL --- */}
        {step === 1 && (
            <div className="animate-fadeIn">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#0D0D0D] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#333]">
                        <FaEnvelope className="text-[#FF6B00] text-2xl" />
                    </div>
                    <h2 className="text-white text-lg font-semibold">Forgot Password?</h2>
                    <p className="text-gray-400 text-sm mt-1">Enter your email to receive an OTP.</p>
                </div>

                <div className="mb-6">
                    <label className="text-gray-500 text-xs font-bold uppercase ml-1 mb-2 block">Email Address</label>
                    <input 
                        type="email" 
                        className="w-full bg-[#0D0D0D] border border-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-gray-600"
                        placeholder="name@example.com" 
                        onChange={(e)=>setEmail(e.target.value)}
                        value={email} 
                    />    
                </div>

                <button 
                    className="w-full bg-[#FF6B00] hover:bg-[#e65c00] text-white py-3 rounded-xl font-bold shadow-lg shadow-[#FF6B00]/20 transition-all active:scale-95 flex justify-center"
                    onClick={handleSendOtp} 
                    disabled={loading}
                >
                    {loading ? <ClipLoader size={20} color='white'/> : "Send OTP"}
                </button>
            </div>
        )}
        
        {/* --- STEP 2: OTP --- */}
        {step === 2 && (
            <div className="animate-fadeIn">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#0D0D0D] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#333]">
                        <FaKey className="text-[#FF6B00] text-2xl" />
                    </div>
                    <h2 className="text-white text-lg font-semibold">Verify OTP</h2>
                    <p className="text-gray-400 text-sm mt-1">Enter the 4-digit code sent to your email.</p>
                </div>

                <div className="mb-6">
                    <label className="text-gray-500 text-xs font-bold uppercase ml-1 mb-2 block">One Time Password</label>
                    <input 
                        type="text" 
                        className="w-full bg-[#0D0D0D] border border-[#333] text-white px-4 py-3 rounded-xl text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-gray-700"
                        placeholder="••••" 
                        maxLength={4}
                        onChange={(e)=>setOtp(e.target.value)} 
                        value={otp} 
                    />    
                </div>

                <button 
                    className="w-full bg-[#FF6B00] hover:bg-[#e65c00] text-white py-3 rounded-xl font-bold shadow-lg shadow-[#FF6B00]/20 transition-all active:scale-95 flex justify-center"
                    onClick={handleVerifyOtp} 
                    disabled={loading}
                >
                    {loading ? <ClipLoader size={20} color='white'/> : "Verify Code"}
                </button>
                
                <p className="text-center text-xs text-gray-500 mt-4 cursor-pointer hover:text-white transition-colors" onClick={() => setStep(1)}>
                    Wrong Email? <span className="underline">Change it</span>
                </p>
            </div>
        )}

        {/* --- STEP 3: RESET PASSWORD --- */}
        {step === 3 && (
            <div className="animate-fadeIn">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#0D0D0D] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#333]">
                        <FaLock className="text-[#FF6B00] text-2xl" />
                    </div>
                    <h2 className="text-white text-lg font-semibold">Create New Password</h2>
                    <p className="text-gray-400 text-sm mt-1">Your new password must be different from previous used passwords.</p>
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="text-gray-500 text-xs font-bold uppercase ml-1 mb-2 block">New Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-[#0D0D0D] border border-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-gray-600"
                            placeholder="Min 6 chars" 
                            onChange={(e)=>setNewPassword(e.target.value)} 
                            value={newPassword}
                        />
                    </div>
                    <div>
                        <label className="text-gray-500 text-xs font-bold uppercase ml-1 mb-2 block">Confirm Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-[#0D0D0D] border border-[#333] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FF6B00] transition-colors placeholder-gray-600"
                            placeholder="Re-enter password" 
                            onChange={(e)=>setConfirmPassword(e.target.value)} 
                            value={confirmPassword}
                        />
                    </div>
                </div>

                <button 
                    className="w-full bg-[#FF6B00] hover:bg-[#e65c00] text-white py-3 rounded-xl font-bold shadow-lg shadow-[#FF6B00]/20 transition-all active:scale-95 flex justify-center"
                    onClick={handleResetPassword} 
                    disabled={loading}
                >
                    {loading ? <ClipLoader size={20} color='white'/> : "Reset Password"}
                </button>
            </div>
        )}

        {/* --- Error Message --- */}
        {err && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center py-2 rounded-lg animate-pulse">
                {err}
            </div>
        )}

      </div>
    </div>
  )
}

export default ForgotPassword