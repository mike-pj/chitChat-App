import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth_routes.js";



const app = express();

const url = process.env.MONGODB_URI;

mongoose
    .connect(url)
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log("Error connecting to DB");
    })

app.use("/api/auth", authRoutes)

const port = process.env.PORT;

app.listen( port , () => {
    console.log( `server is running on port: ${port}` )
});





