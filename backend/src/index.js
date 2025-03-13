import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
// import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import { app, server } from "./lib/socket.js";

import authRoutes from "./routes/auth_routes.js";
import messageRoutes from "./routes/message_routes.js";

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error connecting to DB");
  });

  
  app.use(express.json());
  app.use(cookieParser());
  // app.use(cors({
  //   origin: "http://localhost:5173",
  //   credentials: true,
  // }))
  
const __dirname = path.resolve();

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
};

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
