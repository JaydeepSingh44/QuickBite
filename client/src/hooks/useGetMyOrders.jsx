import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setMyOrders } from '../redux/userSlice.js';

function useGetMyOrders() {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);

  useEffect(() => {
    if (!userData) return; // ✅ VERY IMPORTANT

    const fetchOrders = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/order/my-orders`,
          { withCredentials: true }
        );
        dispatch(setMyOrders(result.data));
      } catch (error) {
        console.log("Fetch my order error:", error.response?.data || error.message);
      }
    };

    fetchOrders();
  }, [userData, dispatch]);
}

export default useGetMyOrders;
