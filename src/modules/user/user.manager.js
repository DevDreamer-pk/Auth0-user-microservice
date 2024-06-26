import userModel from "./user.model.js";
import UserAuth from "../user/auth0.js";
export default class UserManager {
  async signUp(userData) {
    try {
      const { name, email, password, username, signupMethod, displayName } =
        userData;
      const userResponse = await new UserAuth().createUser({
        name,
        email,
        username,
        password,
      });
      if (
        userResponse &&
        (userResponse.error ||
          userResponse.error_description ||
          !userResponse.user_id)
      ) {
        return {
          success: false,
          message: userResponse.error_description
            ? userResponse.error_description
            : userResponse || "Something went wrong",
        };
      }
      const user = new userModel({
        userId: userResponse.user_id,
        name: userResponse.name,
        username: userResponse.username,
        signupMethod: signupMethod,
        email: email,
        displayName: displayName,
      });
      const result = await user.save();
      if (!result) {
        return { success: false, message: "User Not Created" };
      }
      return { success: true, Data: result };
    } catch (error) {
      console.log("Manager Error", error);
      throw error;
    }
  }

  async login(userData) {
    try {
      const { email, password } = userData;
      const user = await userModel.findOne({ email: email });
      if (!user) {
        return { success: false, message: "User Not Found" };
      }
      const accessToken = await new UserAuth().login(email, password);
      if (!accessToken) {
        return { success: false, message: "User Not Found" };
      }
      const result = {
        success: true,
        accessToken: accessToken,
      };
      return result;
    } catch (error) {
      console.log("Manager Error", error);
      throw error;
    }
  }

  async changePassword(userData) {
    try {
      const { userId, newPassword } = userData;
      const user = await userModel.findOne({ userId: userId });
      if (!user) {
        return { success: false, message: "User Not Found" };
      }
      const updatedPass = await new UserAuth().changePassword(
        userId,
        newPassword
      );
      if (!updatedPass) {
        return { success: false, message: "Failed to change password" };
      }
      const result = {
        success: true,
        Data: updatedPass,
      };
      return result;
    } catch (error) {
      console.log("Manager Error", error);
      throw error;
    }
  }

  async forgotPassword(userData) {
    try {
      const { email } = userData;
      const user = await userModel.findOne({ email: email });
      if (!user) {
        return { success: false, message: "User Not Found" };
      }
      const updatedPass = await new UserAuth().forgotPassword(email);
      if (!updatedPass) {
        return { success: false, message: "Failed to change password" };
      }
      const result = {
        success: true,
        Data: updatedPass,
      };
      return result;
    } catch (error) {
      console.log("Manager Error", error);
      throw error;
    }
  }

  async requestGoogleAuth(res) {
    try {
      const url = await new UserAuth().requestGoogleAuth(res);
      if (!url) {
        return { success: false, message: "error in google login" };
      }
      const result = {
        success: true,
        url: url,
      };
      return result;
    } catch (error) {
      console.log("Manager Error", error);
      throw error;
    }
  }

  async googleLogin(req, res) {
    try {
    //   const { accessToken } = userData;
      const userData = await new UserAuth().googleLogin(req, res);
    //   if (!userData) {
    //     return { success: false, message: "User Not Found" };
    //   }
    //   const result = {
    //     success: true,
    //     Data: userData,
    //   };
    //   return result;
    } catch (error) {
      console.log("Manager Error", error);
      throw error;
    }
  }

  async passwordlessLogin(userData) {
    try {
      const { phoneNumber } = userData;
      // const user = await userModel.findOne({ phoneNumber: phoneNumber});
      // if (!user) {
      //     return { success: false, message: "User Not Found" }
      // }
      const updatedPass = await new UserAuth().passwordlessLogin(phoneNumber);
      if (!updatedPass) {
        return { success: false, message: "Unable to login with phone number" };
      }
      const result = {
        success: true,
        Data: updatedPass,
      };
      return result;
    } catch (error) {
      console.log("Manager Error", error);
      throw error;
    }
  }

  async passwordlessVerify(userData) {
    try {
      const { phoneNumber, code } = userData;
      const verified = await new UserAuth().passwordlessVerify(
        phoneNumber,
        code
      );
      // console.log(verified)
      if (!verified) {
        return { success: false, message: "Phone number not verified" };
      }
      const userInfo = await new UserAuth().getUserInfo(
        verified.message.access_token
      );
      // console.log("userInfo", userInfo)
      const userId = userInfo.message.sub;
      // console.log("userId", userId)

      const newUser = new userModel({
        userId: userId,
        phone: phoneNumber,
      });
      const userSaved = await newUser.save();
      if (!userSaved) {
        return { success: false, message: "User Not Saved in DB" };
      }
      const result = {
        success: true,
        message: "Phone number verified successfully and user saved in DB",
        Data: newUser.userId,
      };
      return result;
    } catch (error) {
      console.log("Manager Error", error);
      throw error;
    }
  }

  // Assignment API

  async callback(req, res) {
    try {
      const { code } = req.query;
      console.log("code", code);
      const accessToken = await new UserAuth().getStravaAccessToken(code);
      // console.log(accessToken)
      if (!accessToken) {
        return { success: false, message: "Unable to get access token" };
      }
      const userActivities = await new UserAuth().getUserActivities(
        accessToken.access_token
      );
      // console.log("userInfo", userActivities)
      if (!userActivities) {
        return { success: false, message: "Unable to get user activities" };
      }

      const data = {
        name:
          accessToken.athlete.firstname + " " + accessToken.athlete.lastname,
        profile: accessToken.athlete.profile,
        refresh_token: accessToken.refresh_token,
        access_token: accessToken.access_token,
        userActivities: userActivities,
      };
      return { success: true, data: data };
    } catch (error) {
      console.log("Controller Error", error);
      throw error;
    }
  }
}
