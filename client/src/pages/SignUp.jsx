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
import girlImg from "../assets/girl image.jpg"

function SignUp() {
  const primaryColor = "#FF6B00"; 
  
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate(); 
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          fullName,
          email,
          password,
          mobile,
          role,
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
    if (!mobile) {
      return setErr("Mobile number is required for Google Sign Up");
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          role,
          mobile,
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
          <p className="text-[#FF6B00] text-xs font-bold tracking-widest uppercase mb-2">Start for free</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Create new account<span className="text-[#FF6B00]">.</span></h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Already a member?</span>
            <span 
              onClick={() => navigate("/signin")}
              className="text-[#FF6B00] hover:text-white cursor-pointer font-semibold transition-colors"
            >
              Log In
            </span>
          </div>
        </div>

        {/* Inputs Container - Animation Delay 200ms */}
        <div className="flex flex-col gap-4 max-w-lg animate-slideUp" style={{animationDelay: "200ms"}}>
          
          {/* Row 1: Name & Mobile */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-gray-500 text-xs font-semibold uppercase ml-1 mb-1 block">Full Name</label>
              <input
                type="text"
                className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF6B00] focus:bg-[#252525] transition-all duration-300 placeholder-gray-600"
                placeholder="Ex. John Doe"
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                required
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-500 text-xs font-semibold uppercase ml-1 mb-1 block">Mobile</label>
              <input
                type="text"
                className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF6B00] focus:bg-[#252525] transition-all duration-300 placeholder-gray-600"
                placeholder="Ex. 9876543210"
                onChange={(e) => setMobile(e.target.value)}
                value={mobile}
                required
              />
            </div>
          </div>

          {/* Row 2: Email */}
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

          {/* Row 3: Password */}
          <div>
            <label className="text-gray-500 text-xs font-semibold uppercase ml-1 mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-[#1F1F1F] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF6B00] focus:bg-[#252525] transition-all duration-300 placeholder-gray-600 pr-10"
                placeholder="Create a strong password"
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

          {/* Row 4: Role Selection */}
          <div className="mt-2">
            <label className="text-gray-500 text-xs font-semibold uppercase ml-1 mb-1 block">Select Role</label>
            <div className="flex p-1 bg-[#1F1F1F] rounded-xl border border-gray-800">
              {["user", "owner", "deliveryBoy"].map((r) => (
                <button
                  key={r}
                  className={`flex-1 py-2 rounded-lg text-xs md:text-sm font-bold capitalize transition-all duration-300 transform ${
                    role === r
                      ? "bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20 scale-100"
                      : "text-gray-500 hover:text-white scale-95 hover:scale-100"
                  }`}
                  onClick={() => setRole(r)}
                >
                  {r === "deliveryBoy" ? "Delivery" : r}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {err && <p className="text-red-500 text-xs text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20 animate-pulse">{err}</p>}

          {/* Actions */}
          <div className="flex flex-col-reverse md:flex-row gap-4 mt-4">
            <button 
              onClick={handleGoogleAuth}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white border border-gray-700 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              <FcGoogle size={20} />
              <span className="text-sm">Google</span>
            </button>

            <button
              onClick={handleSignUp}
              disabled={loading}
              className="flex-1 text-white py-3 rounded-full font-bold shadow-lg shadow-blue-900/20 transition-all duration-300 flex justify-center items-center hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:scale-100"
              style={{backgroundColor: primaryColor}} 
            >
              {loading ? <ClipLoader size={20} color='white'/> : "Create account"}
            </button>
          </div>

        </div>
      </div>

      {/* ================= RIGHT SIDE: IMAGE WITH FADE ================= */}
      <div className="hidden lg:block w-1/2 h-full fixed right-0 top-0">
        
        {/* Background Image - Added slight scale animation on load */}
        <div 
          className="absolute inset-0 bg-cover bg-center animate-fadeIn"
          style={{ 
            backgroundImage:`url("${girlImg}")`,
            animationDuration: '1.5s'
          }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent"></div>
        
      </div>

    </div>
  );
}

export default SignUp;