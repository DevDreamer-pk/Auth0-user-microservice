import HttpService from "../../service/httpService.js";
import { jwtDecode } from "jwt-decode";
import CryptoJS from "crypto-js";
// const CryptoJS = require('crypto-js');
export default class Auth {
  getAccessToken = async () => {
    try {
      const storedToken = process.env.ADMIN_ACCESS_TOKEN;
      if (storedToken) {
        const decodeRes = jwtDecode(storedToken);
        if (decodeRes.exp > Date.now() / 1000) {
          return storedToken;
        }
      }
      const tokenBody = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        audience: process.env.AUDIENCE,
        grant_type: "client_credentials",
        scope: process.env.SCOPE,
      };
      const headers = { "Content-Type": "application/json" };
      const accessTokenResponse = await HttpService.executeHTTPRequest(
        "POST",
        process.env.AUTH0_DOMAIN,
        "/oauth/token",
        headers,
        tokenBody
      );
      if (
        accessTokenResponse &&
        (accessTokenResponse.error ||
          accessTokenResponse.error_description ||
          !accessTokenResponse.access_token)
      ) {
        throw new Error(
          accessTokenResponse.error_description
            ? accessTokenResponse.error_description
            : accessTokenResponse || "Something went wrong"
        );
      }
      process.env.ADMIN_ACCESS_TOKEN = accessTokenResponse.access_token;
      return accessTokenResponse.access_token;
    } catch (error) {
      console.log(error);
      throw {
        message: error.message,
      };
    }
  };

  createUser = async (userData) => {
    try {
      userData.connection = process.env.connection;
      const token = await this.getAccessToken();

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const userResponse = await HttpService.executeHTTPRequest(
        "POST",
        process.env.AUTH0_DOMAIN,
        "/api/v2/users",
        headers,
        userData
      );
      if (
        userResponse &&
        (userResponse.error ||
          userResponse.error_description ||
          !userResponse.user_id)
      ) {
        throw new Error(
          userResponse.error_description
            ? userResponse.error_description
            : userResponse || "Something went wrong"
        );
      }
      return userResponse;
    } catch (error) {
      console.log(error);
      throw {
        message: error.message,
      };
    }
  };

  login = async (username, password) => {
    try {
      const tokenBody = {
        client_id: process.env.CLIENT_ID,
        audience: process.env.AUDIENCE,
        realm: process.env.CONNECTION,
        scope: "",
        grant_type: "http://auth0.com/oauth/grant-type/password-realm",
        username,
        password,
      };
      const headers = { "Content-Type": "application/json" };
      const loginResponse = await HttpService.executeHTTPRequest(
        "POST",
        process.env.AUTH0_DOMAIN,
        "/oauth/token",
        headers,
        tokenBody
      );
      if (
        loginResponse &&
        (loginResponse.error ||
          loginResponse.error_description ||
          !loginResponse.access_token)
      ) {
        throw new Error(
          loginResponse.error_description
            ? loginResponse.error_description
            : loginResponse || "Something went wrong"
        );
      }
      console.log("loginResponse", loginResponse);
      return loginResponse;
    } catch (error) {
      // console.log(error)
      throw {
        message: error.response.data.error_description,
        status: error.response.status,
      };
    }
  };

  changePassword = async (userId, newPassword) => {
    const token = await this.getAccessToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      // const bytes = CryptoJS.AES.decrypt(
      //     newPassword,
      //     process.env.ENCRYPTION_SECRET_KEY
      //   );
      //   const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
      //   console.log("decryptedPassword",decryptedPassword)

      // let requestObj = {
      //     password : decryptedPassword,
      //     connection : process.env.CONNECTION
      // }
      const changePasswordResponse = await HttpService.executeHTTPRequest(
        "PATCH",
        process.env.AUTH0_DOMAIN,
        `/api/v2/users/${userId}`,
        headers,
        {
          password: newPassword,
        }
      );
      if (
        changePasswordResponse &&
        (changePasswordResponse.error ||
          changePasswordResponse.error_description ||
          !changePasswordResponse.user_id)
      ) {
        throw new Error(
          changePasswordResponse.error_description
            ? changePasswordResponse.error_description
            : changePasswordResponse || "Something went wrong"
        );
      }
      return changePasswordResponse;
    } catch (error) {
      console.log(error);
      throw {
        message: error.message,
      };
    }
  };

  forgotPassword = async (email) => {
    try {
      const headers = { "Content-Type": "application/json" };
      let requestObj = {
        client_id: process.env.CLIENT_ID,
        connection: process.env.CONNECTION,
        email,
      };
      const forgotPasswordResponse = await HttpService.executeHTTPRequest(
        "POST",
        process.env.AUTH0_DOMAIN,
        "/dbconnections/change_password",
        headers,
        requestObj
      );

      if (forgotPasswordResponse && forgotPasswordResponse.error) {
        throw new Error(forgotPasswordResponse.error);
      }

      return { message: forgotPasswordResponse };
    } catch (error) {
      throw {
        message: error.message,
      };
    }
  };

  passwordlessLogin = async (phoneNumber) => {
    try {
      const headers = { "Content-Type": "application/json" };
      let requestObj = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        connection: "sms",
        phone_number: phoneNumber,
      };
      const passwordlessLoginResponse = await HttpService.executeHTTPRequest(
        "POST",
        process.env.AUTH0_DOMAIN,
        "/passwordless/start",
        headers,
        requestObj
      );

      if (passwordlessLoginResponse && passwordlessLoginResponse.error) {
        throw new Error(passwordlessLoginResponse.error);
      }

      return { message: passwordlessLoginResponse };
    } catch (error) {
      console.log(error);
      throw {
        message: error.response.data.error_description,
        status: error.response.status,
      };
    }
  };

  passwordlessVerify = async (phoneNumber, code) => {
    try {
      const headers = { "Content-Type": "application/json" };
      let requestObj = {
        grant_type: "http://auth0.com/oauth/grant-type/passwordless/otp",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        realm: "sms",
        audience: process.env.AUDIENCE,
        username: phoneNumber,
        otp: code,
        scope: "openid profile email",
      };
      const passwordlessVerifyResponse = await HttpService.executeHTTPRequest(
        "POST",
        process.env.AUTH0_DOMAIN,
        "/oauth/token",
        headers,
        requestObj
      );

      if (passwordlessVerifyResponse && passwordlessVerifyResponse.error) {
        throw new Error(passwordlessVerifyResponse.error);
      }

      return { message: passwordlessVerifyResponse };
    } catch (error) {
      console.log(error);
      throw {
        message: error.response.data.error_description,
        status: error.response.status,
      };
    }
  };

  getUserInfo = async (accessToken) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };
      const getUserInfoResponse = await HttpService.executeHTTPRequest(
        "GET",
        process.env.AUTH0_DOMAIN,
        "/userinfo",
        headers
      );
      if (getUserInfoResponse && getUserInfoResponse.error) {
        throw new Error(getUserInfoResponse.error);
      }
      return { message: getUserInfoResponse };
    } catch (error) {
      throw {
        message: error.response.data.error_description,
        status: error.response.status,
      };
    }
  };

  // Assignment API

  getStravaAccessToken = async (code) => {
    try {
      const headers = { "Content-Type": "application/json" };
      let params = {
        client_id: "125365",
        client_secret: "1e9e7652bc1b671427077419d723f841b90819ea",
        grant_type: "authorization_code",
        code: code,
      };
      const getStravaAccessTokenResponse = await HttpService.executeHTTPRequest(
        "POST",
        "https://www.strava.com/api/v3",
        "/oauth/token",
        headers,
        params
      );
      if (getStravaAccessTokenResponse && getStravaAccessTokenResponse.error) {
        throw new Error(getStravaAccessTokenResponse.error);
      }
      return getStravaAccessTokenResponse;
    } catch (error) {
      console.log(error);
      throw {
        message: error.response.data.error_description,
        status: error.response.status,
      };
    }
  };

  getUserActivities = async (accessToken) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };
      const getUserActivitiesResponse = await HttpService.executeHTTPRequest(
        "GET",
        "https://www.strava.com/api/v3",
        "/athlete/activities?",
        headers
      );
      if (getUserActivitiesResponse && getUserActivitiesResponse.error) {
        throw new Error(getUserActivitiesResponse.error);
      }
      return { message: getUserActivitiesResponse };
    } catch (error) {
      throw {
        message: error.response.data.error_description,
        status: error.response.status,
      };
    }
  };
}
