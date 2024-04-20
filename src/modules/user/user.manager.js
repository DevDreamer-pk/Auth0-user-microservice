import userModel from "./user.model.js";
import UserAuth from "../user/auth0.js";
export default class UserManager {
    
    async signUp(userData) {    
        try {
         const {  name, email, password, username, signupMethod, displayName } = userData;
         const userResponse = await new UserAuth().createUser({name, email, username, password});
         if (userResponse && (userResponse.error || userResponse.error_description || !userResponse.user_id)) {
             return { success: false, message: userResponse.error_description ? userResponse.error_description : userResponse || "Something went wrong" }
         }
         const user = new userModel(
          {
            userId: userResponse.user_id,
            name : userResponse.name,
            username : userResponse.username,
            signupMethod: signupMethod,
            email: email,
            displayName: displayName,
          }
        );
        const result = await user.save();
        if (!result) {
            return { success: false, message: "User Not Created" }
        }
        return { success: true, Data: result };
      } catch (error) {
        console.log("Manager Error", error);
        throw new Error(error);
      }
    }

    async login(userData) {
        try {
            const {  email, password } = userData;
            const user = await userModel.findOne({ email: email});
            if (!user) {
                return { success: false, message: "User Not Found" }
            }
            const accessToken = await new UserAuth().login(email, password);
            if (!accessToken) {
                return { success: false, message: "User Not Found" }
            }
            const result = {
                success: true,
                accessToken: accessToken
            }
            return result
        } catch (error) {
            console.log("Manager Error", error);
            throw error;
        }
    }
}