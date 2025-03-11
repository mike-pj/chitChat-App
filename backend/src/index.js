import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth_routes.js";
import messageRoutes from "./routes/message_routes.js";

const app = express();

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
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
