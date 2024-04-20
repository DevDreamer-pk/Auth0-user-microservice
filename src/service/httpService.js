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





//   response: {
//     status: 429,
//     statusText: 'Too Many Requests',
//     headers: Object [AxiosHeaders] {
//       date: 'Sat, 20 Apr 2024 14:01:18 GMT',
//       'content-type': 'application/json; charset=utf-8',
//       'content-length': '188',
//       connection: 'keep-alive',
//       'cf-ray': '8775aa60cf425460-DEL',
//       'cf-cache-status': 'DYNAMIC',
//       'cache-control': 'private, no-store, no-cache, must-revalidate, post-check=0, pre-check=0, no-transform',
//       etag: 'W/"bc-SFjNAkf53zH132Z6mOM6PrhvyT4"',
//       'set-cookie': [Array],
//       'strict-transport-security': 'max-age=31536000; includeSubDomains',
//       vary: 'Origin, Accept-Encoding',
//       'x-auth0-requestid': 'ad9a4546edac67dd0a39',
//       'x-content-type-options': 'nosniff',
//       'x-ratelimit-limit': '10',
//       'x-ratelimit-remaining': '0',
//       'x-ratelimit-reset': '0',
//       server: 'cloudflare',
//       'alt-svc': 'h3=":443"; ma=86400'
//     },
//     config: {
//       transitional: [Object],
//       adapter: [Array],
//       transformRequest: [Array],
//       transformResponse: [Array],
//       timeout: 0,
//       xsrfCookieName: 'XSRF-TOKEN',
//       xsrfHeaderName: 'X-XSRF-TOKEN',
//       maxContentLength: -1,
//       maxBodyLength: -1,
//       env: [Object],
//       validateStatus: [Function: validateStatus],
//       headers: [Object [AxiosHeaders]],
//       method: 'post',
//       url: 'https://dev-pmm8rpucnkwrplvb.us.auth0.com/oauth/token',
//       data: '{"client_id":"MW8D6l5Wx8n62mO9upbj12H5WguPHsPy","audience":"https://dev-pmm8rpucnkwrplvb.us.auth0.com/api/v2/","realm":"Username-Password-Authentication","scope":"","grant_type":"http://auth0.com/oauth/grant-type/password-realm","username":"mayank@gmail.com","password":"Mayank@12"}'
//     },
//     request: <ref *1> ClientRequest {
//       _events: [Object: null prototype],
//       _eventsCount: 7,
//       _maxListeners: undefined,
//       outputData: [],
//       outputSize: 0,
//       writable: true,
//       destroyed: true,
//       _last: false,
//       chunkedEncoding: false,
//       shouldKeepAlive: true,
//       maxRequestsOnConnectionReached: false,
//       _defaultKeepAlive: true,
//       useChunkedEncodingByDefault: true,
//       sendDate: false,
//       _removedConnection: false,
//       _removedContLen: false,
//       _removedTE: false,
//       strictContentLength: false,
//       _contentLength: '282',
//       _hasBody: true,
//       _trailer: '',
//       finished: true,
//       _headerSent: true,
//       _closed: true,
//       socket: [TLSSocket],
//       _header: 'POST /oauth/token HTTP/1.1\r\n' +
//         'Accept: application/json, text/plain, */*\r\n' +
//         'Content-Type: application/json\r\n' +
//         'User-Agent: axios/1.6.8\r\n' +
//         'Content-Length: 282\r\n' +
//         'Accept-Encoding: gzip, compress, deflate, br\r\n' +
//         'Host: dev-pmm8rpucnkwrplvb.us.auth0.com\r\n' +
//         'Connection: keep-alive\r\n' +
//         '\r\n',
//       _keepAliveTimeout: 0,
//       _onPendingData: [Function: nop],
//       agent: [Agent],
//       socketPath: undefined,
//       method: 'POST',
//       maxHeaderSize: undefined,
//       insecureHTTPParser: undefined,
//       joinDuplicateHeaders: undefined,
//       path: '/oauth/token',
//       _ended: true,
//       res: [IncomingMessage],
//       aborted: false,
//       timeoutCb: null,
//       upgradeOrConnect: false,
//       parser: null,
//       maxHeadersCount: null,
//       reusedSocket: false,
//       host: 'dev-pmm8rpucnkwrplvb.us.auth0.com',
//       protocol: 'https:',
//       _redirectable: [Writable],
//       [Symbol(shapeMode)]: false,
//       [Symbol(kCapture)]: false,
//       [Symbol(kBytesWritten)]: 0,
//       [Symbol(kNeedDrain)]: false,
//       [Symbol(corked)]: 0,
//       [Symbol(kOutHeaders)]: [Object: null prototype],
//       [Symbol(errored)]: null,
//       [Symbol(kHighWaterMark)]: 16384,
//       [Symbol(kRejectNonStandardBodyWrites)]: false,
//       [Symbol(kUniqueHeaders)]: null
//     },
//     data: {
//       error: 'too_many_attempts',
//       error_description: "Your account has been blocked after multiple consecutive login attempts. We've sent you an email with instructions on how to unblock it."
//     }
//   }
// }



