import User from "./models/user.model.js"

export const socketHandler = (io) => {

  io.on("connection", (socket) => {

    console.log("Socket connected:", socket.id)

    socket.on("identity", ({ userId }) => {
      if (!userId) return

      socket.join(userId)   // 🔥 join room by userId
      console.log("User joined room:", userId)
    })

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id)
    })

  })

}
