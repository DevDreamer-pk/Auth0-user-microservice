import express from "express";

import userController from "./user.controller.js"
const userRouter = express.Router();

userRouter.post("/signup", new userController().signUp) 
userRouter.post("/login", new userController().login)
userRouter.post("/change-password", new userController().changePassword)
userRouter.post("/forgot-password", new userController().forgotPassword)


// Application type must be Regular web application, Applications --> settings  --> Application type
// Applications --> settings  --> Advanced Settings --> Grant Types --> Passwordless OTP should be enabled.
// Authentication --> Database --> Authentication Methods --> passkey should be enabled which includes identifire first enabled
// Authentication --> setup Passwordless for SMS or Email 
userRouter.post("/passwordless-login", new userController().passwordlessLogin)  
userRouter.post("/passwordless-verify", new userController().passwordlessVerify)


// Assignment API

userRouter.get("/callback", new userController().callback)

export default userRouter