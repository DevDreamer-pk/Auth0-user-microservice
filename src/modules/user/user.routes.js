import express from "express";

import userController from "./user.controller.js"
const userRouter = express.Router();

userRouter.post("/signup", new userController().signUp) 
userRouter.post("/login", new userController().login)

export default userRouter