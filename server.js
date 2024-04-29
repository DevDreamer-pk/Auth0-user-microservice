import dotenv from "dotenv";
dotenv.config()
import express from "express";
import cors from "cors";

import userRouter from "./src/modules/user/user.routes.js";

import bodyParser from "body-parser";

import connectDB from "./src/config/dbConnection.js";



const app = express();
var corsOptions = {
    origin: "http://localhost:3000", 
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],  
}
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use("/api/user", userRouter)

app.listen(process.env.PORT, () => {
    connectDB();
    console.log(`Server is running on port ${process.env.PORT}`);
})