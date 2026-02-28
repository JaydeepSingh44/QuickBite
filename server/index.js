import express from "express";
import dotenv from "dotenv";
dotenv.config()
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";
import http from "http"
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";


const app = express();
const server=http.createServer(app)

const io=new Server(server,{
    cors:{
    origin:"https://quickbite-8e31.onrender.com",
    credentials:true,
    methods:['POST','GET']
}
})

app.set("io",io)
socketHandler(io)


const port=process.env.PORT || 5000;
app.use(cors({
    origin:"https://quickbite-8e31.onrender.com",
    credentials:true,
}))
app.use(express.json());
app.use(cookieParser())

app.get('/api/health', (req, res) => {
  console.log("Health Check: Server is awake!");
  res.status(200).json({ status: 'Server is awake', timestamp: new Date() });
});

app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/shop",shopRouter);
app.use("/api/item",itemRouter);
app.use("/api/order",orderRouter)


server.listen(port,()=>{

    console.log(`server started at port ${port}`);
    connectDb();
})

