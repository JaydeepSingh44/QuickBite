import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import girlImg from "../assets/girl image.jpg"; 

function SignIn() {
  const primaryColor = "#FF6B00"; 
  
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setErr("");
      setLoading(false);
    } catch (error) {
      setErr(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          email: result.user.email,
        },
        { withCredentials: true }
      );

      dispatch(setUserData(data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0D0D0D] overflow-hidden animate-fadeIn">
      
      {/* ================= LEFT SIDE: FORM ================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-10 z-20 bg-[#0D0D0D]">
        
        {/* Logo - Animation Delay 0ms */}
        <div className="mb-10 animate-slideUp">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
            <div className="w-3 h-3 rounded-full bg-[#FF6B00]"></div>
            QuickBite
          </h1>
        </div>

        {/* Header Text - Animation Delay 100ms */}
        <div className="mb-8 animate-slideUp" style={{animationDelay: "100ms"}}>
          <p className="text-[#FF6B00] text-xs font-bold tracking-widest uppercase mb-2">Welcome Back</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Sign In to account<span className="text-[#FF6B00]">.</span></h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">New here?</span>
            <span 
              onClick={() => navigate("/signup")}
              className="text-[#FF6B00] hover:text-white cursor-pointer font-semibold transition-colors"
            >
              Create Account
            </span>
          </div>
        </div>

        {/* Inputs Container - Animation Delay 200ms */}
        <div className="flex flex-col gap-5 max-w-lg animate-slideUp" style={{animationDelay: "200ms"}}>
          
          {/* Email Input */}
          <div>
            <label className="text-gray-500 text-xs font-semibold uppercase ml-1 mb-1 block">Email</label>
            <input
              type="email"
              className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF6B00] focus:bg-[#252525] transition-all duration-300 placeholder-gray-600"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="text-gray-500 text-xs font-semibold uppercase ml-1 mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF6B00] focus:bg-[#252525] transition-all duration-300 placeholder-gray-600 pr-10"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <button className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer' 
                onClick={() => setShowPassword(prev => !prev)}>
                {!showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <span 
              className="text-[#FF6B00] text-xs font-bold uppercase tracking-wide cursor-pointer hover:text-white transition-colors hover:underline" 
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </span>
          </div>

          {/* Error Message */}
          {err && <p className="text-red-500 text-xs text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20 animate-pulse">*{err}</p>}

          {/* Actions */}
          <div className="flex flex-col-reverse md:flex-row gap-4 mt-2">
            
            {/* Google Button */}
            <button 
              onClick={handleGoogleAuth}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white border border-gray-700 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              <FcGoogle size={20} />
              <span className="text-sm">Google</span>
            </button>

            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="flex-1 bg-[#FF6B00] hover:bg-[#e65a00] text-white py-3 rounded-full font-bold shadow-lg shadow-[#FF6B00]/20 transition-all duration-300 flex justify-center items-center hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:scale-100"
            >
              {loading ? <ClipLoader size={20} color='white'/> : "Sign In"}
            </button>

          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: IMAGE WITH FADE ================= */}
      <div className="hidden lg:block w-1/2 h-full fixed right-0 top-0">
        
        {/* Background Image Container */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-fadeIn"
          style={{ 
            backgroundImage: `url("${girlImg}")`,
            animationDuration: '1.5s'
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent"></div>
        </div>
        
      </div>

    </div>
  );
}

export default SignIn;