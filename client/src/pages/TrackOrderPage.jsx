import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import DeliveryBoyTracking from '../components/DeliveryBoyTracking';


function TrackOrderPage() {
   const {orderId} = useParams()
   const navigate = useNavigate()
const [currentOrder, setCurrentOrder] = useState()
const handleGetOrder = async () => {
    try {
        const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, {withCredentials: true})
        setCurrentOrder(result.data)
    } catch (error) {
        console.log(error)
    }
}

useEffect(() => {
    handleGetOrder()
}, [orderId])
 
  return (
    
<div className='max-w-4xl mx-auto p-4 flex flex-col gap-6'>
  <div className='relative flex items-center gap-4 top-[20px] 
  left-[20px] z-[10] mb-[10px]' onClick={() => navigate("/")}>
    <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
    <h1 className='text-2xl font-bold md:text-center'>Track Order</h1>
  </div>
 {currentOrder?.shopOrders?.map((shopOrder, index) => (
  <div className="bg-white p-4 rounded-2xl shadow-md border border-orange-1 space-y-4" key={index}>
    <div>
      <p className="text-lg font-bold mb-2 text-[#ff4d2d]">{shopOrder.shop.name}</p>
      <p className="font-semibold"><span>Items:</span> {shopOrder.shopOrderItems?.map(i => i.item?.name).join(", ")}</p>
      <p><span className="font-semibold">Subtotal:</span> {shopOrder.subtotal}</p>
      <p className="mt-6"><span className="font-semibold">Delivery address:</span> {currentOrder.deliveryAddress?.text}</p>
</div>
{shopOrder.status === "delivered" ? (
  <p className="text-green-600 font-semibold text-lg">
    Delivered
  </p>
) : shopOrder.assignedDeliveryBoy ? (
  <div className="text-sm text-gray-700 mt-4">
    <p className="font-semibold">
      Delivery Boy Name: {shopOrder.assignedDeliveryBoy.fullName}
    </p>
    <p className="font-semibold">
      Contact No: {shopOrder.assignedDeliveryBoy.mobile}
    </p>
    <p className="text-orange-500 font-semibold mt-2">
      Status: {shopOrder.status}
    </p>
  </div>
) : (
  <p className="font-semibold text-gray-500 mt-4">
    Delivery Boy not assigned yet.
  </p>
)}


{shopOrder.assignedDeliveryBoy && shopOrder.status!=="delivered" &&
<div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md">
  <DeliveryBoyTracking data={{
    deliveryBoyLocation: {
      lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
      lon: shopOrder.assignedDeliveryBoy.location.coordinates[0]
    },
    customerLocation: {
      lat: currentOrder.deliveryAddress.latitude,
      lon: currentOrder.deliveryAddress.longitude
    }
  }}/>
</div>}


</div>

))}

</div>


  )
}

export default TrackOrderPage