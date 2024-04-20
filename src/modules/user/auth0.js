import HttpService from "../../service/httpService.js";
import {jwtDecode } from "jwt-decode";
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
                scope : process.env.SCOPE
            }
            const headers = { "Content-Type": "application/json" }
            const accessTokenResponse = await HttpService.executeHTTPRequest(
                "POST",
                process.env.AUTH0_DOMAIN,
                "/oauth/token",
                headers,
                tokenBody
            )
            if(accessTokenResponse && (accessTokenResponse.error || accessTokenResponse.error_description || !accessTokenResponse.access_token)){
                throw new Error(accessTokenResponse.error_description ? accessTokenResponse.error_description : accessTokenResponse || "Something went wrong")
            }
            process.env.ADMIN_ACCESS_TOKEN = accessTokenResponse.access_token
            return accessTokenResponse.access_token

        } catch (error) {
            console.log(error)
            throw {
                message: error.message
            };
        }
    }

    createUser = async (userData) => {
        try {

            userData.connection = process.env.connection;
            const token = await this.getAccessToken();

            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
            const userResponse = await HttpService.executeHTTPRequest(
                "POST",
                process.env.AUTH0_DOMAIN,
                "/api/v2/users",
                headers,
                userData
            )
            if(userResponse && (userResponse.error || userResponse.error_description || !userResponse.user_id)){
                throw new Error(userResponse.error_description ? userResponse.error_description : userResponse || "Something went wrong")
            }
            return userResponse
        } catch (error) {
            console.log(error)
            throw {
                message: error.message
            };
        }
    }

    login = async (username, password) => {
        try {
            const tokenBody = {
                client_id : process.env.CLIENT_ID,
                audience : process.env.AUDIENCE,
                realm : process.env.CONNECTION,
                scope : "",
                grant_type : "http://auth0.com/oauth/grant-type/password-realm",
                username,
                password
            }   
            const headers = { "Content-Type": "application/json" }
            const loginResponse = await HttpService.executeHTTPRequest(
                "POST",
                process.env.AUTH0_DOMAIN,
                "/oauth/token",
                headers,
                tokenBody
            )
            if(loginResponse && (loginResponse.error || loginResponse.error_description || !loginResponse.access_token)){
                throw new Error(loginResponse.error_description ? loginResponse.error_description : loginResponse || "Something went wrong")
            }
            console.log("loginResponse",loginResponse)
            return loginResponse;
        } catch (error) {
            // console.log(error)
            throw {
                message: error.response.data.error_description,
                status: error.response.status
            }
        }

    }
}