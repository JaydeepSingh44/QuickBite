import React from 'react'

function UserOrderCard({ data }) {

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusStyle = (status) => {
    if (status === "delivered") return "bg-green-100 text-green-700"
    if (status === "preparing") return "bg-yellow-100 text-yellow-700"
    return "bg-orange-100 text-orange-700"
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-[#ffe5dc] p-5 space-y-6">

      {/* ===== ORDER HEADER ===== */}
      <div className="flex justify-between items-start border-b border-dashed pb-3">
        <div>
          <p className="text-lg font-bold text-gray-800">
            Order #{data._id.slice(-6)}
          </p>
          <p className="text-sm text-gray-500">
            {formatDate(data.createdAt)}
          </p>
        </div>

        <div className="text-right space-y-1">
          <p className="text-xs text-gray-500 uppercase">
            {data.paymentMethod}
          </p>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
              data.shopOrders?.[0]?.status
            )}`}
          >
            {data.shopOrders?.[0]?.status}
          </span>
        </div>
      </div>

      {/* ===== SHOP ORDERS ===== */}
      <div className="space-y-5">
        {data.shopOrders.map((shopOrder, index) => (
          <div
            key={index}
            className="rounded-xl border border-[#ffd8cc] bg-[#fff1ec] p-4 space-y-3"
          >
            {/* Shop Name */}
            <p className="font-semibold text-gray-800 text-base">
              🍽 {shopOrder.shop.name}
            </p>

            {/* Items */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {shopOrder.shopOrderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-36 bg-white rounded-xl shadow-sm border p-2"
                >
                  <img
                    src={item.item.image}
                    alt={item.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <p className="text-sm font-semibold mt-1 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty {item.quantity} × ₹{item.price}
                  </p>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center border-t pt-2">
              <p className="font-semibold text-gray-800">
                Subtotal: ₹{shopOrder.subtotal}
              </p>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyle(
                  shopOrder.status
                )}`}
              >
                {shopOrder.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ===== FOOTER ===== */}
      <div className="flex justify-between items-center border-t pt-4">
        <p className="text-xl font-bold text-gray-900">
          Total: ₹{data.totalAmount}
        </p>
        <button className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-6 py-2 rounded-xl text-sm font-semibold shadow">
          Track Order
        </button>
      </div>

    </div>
  )
}

export default UserOrderCard
