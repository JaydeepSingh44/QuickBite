import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData,setAuthLoading } from '../redux/userSlice.js';


function useGetCurrentUser() {
    const dispatch = useDispatch();
   useEffect(()=>{
    const fetchUser = async () =>{
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`,
            {withCredentials:true})
            dispatch(setUserData(result.data))
            dispatch(setAuthLoading(false))
            
        } catch (error) {
            console.log(error)
            
        }
        
            
    }
    fetchUser()



   },[])
    
}

export default useGetCurrentUser