import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners"

function SignUp() {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false);
  const [role,setRole] = useState("user");
  const nevigate=useNavigate();
  const[fullName, setFullName] = useState("")
  const[email, setEmail] = useState("")
  const[password, setPassword] = useState("")
  const[mobile, setMobile] = useState("")
  const[err,setErr] = useState("")
  const[loading,setLoading] = useState(false)


  
  const handleSignUp=async() =>{
    setLoading(true);
    try{
      const result = await axios.post(`${serverUrl}/api/auth/signup`,{
        fullName,email,password,mobile,role
      },{withCredentials:true});
      console.log(result);
      setErr("")
      setLoading(false);

    }catch(error){
      setErr(error?.response?.data?.message); 
      setLoading(false);
    }

    
  }

  const handleGoogleAuth = async() =>{

    if(!mobile){
      return setErr("mobile no is required")
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth,provider);
    try{
      const {data} = await axios.post(`${serverUrl}/api/auth/google-auth`,{
        fullName:result.user.displayName,
        email:result.user.email,
        role,
        mobile,
      },{withCredentials:true})
      console.log(data);

    }catch(error){
      console.log(error)

    }
  }


  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px]"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
          QuickBite
        </h1>
        <p className="text-gray-600 mb-8">
          Create your account to get started with delicious food deliveries
        </p>


{ /*----------------full name ----------*/}
        
        

        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-gray-700 font-medium mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none "
            placeholder="Enter your Full Name"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e)=>setFullName(e.target.value)}
            value={fullName} required/>
        </div>


 {/*----------------E-mail ----------*/}
        
        <div className="mb-4">
          <label
            htmlFor="Email"
            className="block text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none "
            placeholder="Enter your Email"
            style={{ border: `1px solid ${borderColor}` }}
             onChange={(e)=>setEmail(e.target.value)}
            value={email}
             required/>
        </div>




 {/*----------------Mobile ----------*/}


        <div className="mb-4">
          <label
            htmlFor="Mobile"
            className="block text-gray-700 font-medium mb-1"
          >
            Mobile
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none "
            placeholder="Enter your Mobile"
            style={{ border: `1px solid ${borderColor}` }}
             onChange={(e)=>setMobile(e.target.value)}
            value={mobile}
             required/>
        </div>


    {/*----------------Password ----------*/}     

       <div className='mb-4'>
  <label htmlFor='password' className='block text-gray-700 font-medium mb-1'>Password</label>
  <div className='relative'>
    <input type={`${showPassword ? "text" : "password"}`}
      className='w-full border rounded-lg px-3 py-2 focus:outline-none pr-10' 
      placeholder='Enter your password' 
      style={{ border: '1px solid {borderColor}' }} 
      onChange={(e)=>setPassword(e.target.value)} 
      value={password} 
      required/>
    <button className='absolute right-3 cursor-pointer top-[14px] text-gray-500' 
      onClick={() => setShowPassword(prev => !prev)}>
      {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
    </button>
  </div>
</div>



        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            role
          </label>
          <div className="flex gap-2">
          {["user","owner","deliveryBoy"].map((r)=>(
            <button 
            key={r} 
             className="flex-1 border rounded-lg px-3 py-2 text-center font-medium 
            transition-colors cursor-pointer" 

            onClick={()=>setRole(r)}
            style={
              role==r?
              {backgroundColor:primaryColor,color:"white"}
              :{border:`1px solid ${primaryColor}`, color:primaryColor}
            }>{r}</button>
          ))}
            
          </div>
        </div>
          

          <button className={`w-full font-semibold py-2 rounded-lg transition duration-200
          bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`
            
          } onClick={handleSignUp} disabled={loading}>

            {loading?<ClipLoader size={20} color='white'/>: "Sign Up"}

            
          </button>

          {err && <p className="text-red-500 text-center my-[10px]">*{err}</p>}
          

          <button className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition 
          duration-200 cursor-pointer border-gray-400 hover:bg-gray-100" onClick={handleGoogleAuth}>
            <FcGoogle size={20} />
            <span>Sign up with Google</span>
            </button>
            <p className="text-center mt-6 cursor-pointer" 
            onClick={()=>nevigate("/signin")}>
              Already have an account ?? <span className="text-[#ff4d2d]">Sign In</span> 
            </p>


      </div>
    </div>
  );
}

export default SignUp;
