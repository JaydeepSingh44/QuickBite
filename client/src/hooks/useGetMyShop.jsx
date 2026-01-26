import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice.js';
import { setMyShopData } from '../redux/ownerSlice.js';


function useGetMyShop() {
    const dispatch = useDispatch();
   useEffect(() => {

  const fetchShop = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/shop/get-my`,
        { withCredentials: true }
      );
const shop = result.data;
      if (!shop || !shop._id) {
        dispatch(setMyShopData(null));
         } else {
          dispatch(setMyShopData({
            ...shop,
          items: shop.items || []
           }));
          }
    } catch (error) {
      console.log("❌ Fetch shop error:", error);
      dispatch(setMyShopData(null));
    }
  };

  fetchShop();
}, [dispatch]);
    
}

export default useGetMyShop