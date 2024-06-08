import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve(); // this path will be coming from nodeJS

// app.get("/",(req,res)=>{
//     // root route http://localhost:5000/
//     res.send("Hello World!!");
// });

// app.get("/api/auth/signup",(req,res)=>{
//     console.log("signup route");
// });

// app.get("/app/auth/login",(req,res)=>{
//     console.log("login route");
// });

// app.get("/app/auth/logout",(req,res)=>{
//     console.log("logout route");
// });

// instead of writing api calls for every line
// we will use middleware

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser()); // to access the cookies

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname,"/frontend/dist"))); // serve static files such as html css javascript images sounds files
                                // we are going into the dirname/frontend/dist folder

app.get("*",(req,res) => {
    res.sendFile(path.join(__dirname,"frontend","dist","index.html")); // run our frontend from server as well
})

// any route other than the main three, can you render the index.html in frontend/dist

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
