import dotenv from "dotenv";
dotenv.config()
import express from "express";

import userRouter from "./src/modules/user/user.routes.js";

import bodyParser from "body-parser";

import connectDB from "./src/config/dbConnection.js";

const app = express();
app.use(bodyParser.json());

app.use("/api/user", userRouter)

app.listen(process.env.PORT, () => {
    connectDB();
    console.log("Server started on port 3000");
})