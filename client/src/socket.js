import { io } from "socket.io-client"

export const socket = io("https://quickbite-toeo.onrender.com", {
  withCredentials: true
})
