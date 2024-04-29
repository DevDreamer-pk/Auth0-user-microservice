import axios from "axios";

export default class HttpService {
    static async executeHTTPRequest(method, hostname, path, headers, data) {
          /**
   * It takes a method, hostname, path, headers, and data as parameters, and then it uses the axios
   * library to make an HTTP request to the hostname and path with the headers and data
   * @param method - The HTTP method to use (GET, POST, PUT, DELETE, etc.)
   * @param hostname - The hostname of the server you're trying to connect to.
   * @param path - The path to the API endpoint.
   * @param headers - The headers to send with the request
   * @param data - The data to be sent to the server.
   * @returns The data from the response.
   * @error Throws an error if api request fails
   */
        try {
            const { data: responseData } = await axios({
                method,
                url: `${hostname}${path}`,
                headers,
                data
            })
            // console.log("data",data)
            return responseData

        } catch (error) {
            // console.log(error.response.data)
           throw error;
        }
    }
}






