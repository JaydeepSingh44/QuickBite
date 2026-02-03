import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setMyOrders, setUserData } from '../redux/userSlice.js';
import { setMyShopData } from '../redux/ownerSlice.js';


function useGetMyOrders() {
    const dispatch = useDispatch();
   useEffect(() => {
   
  const fetchOrders = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/my-orders`,
        { withCredentials: true }
      );
      dispatch(setMyOrders(result.data))
    } catch (error) {
      console.log("Fetch my order error:", error);
     
    }
  };

  fetchOrders();
}, [dispatch]);
    
}

export default useGetMyOrders