const request = require('request');

const LOG_POOL_INFO = true;
const LOG_STATS_INFO = true;

// options for the HTTP call to the other server
const httpCallOptions = {  
    url: '',
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8'
    },
    //body: A Buffer, String, or Stream object (can be an object if json option is set to true)
    json: true,
    body: ''
};

// persistent request object (based on the specified options)
const persistentRequest = request.defaults({
    // HTTP agent options
    agentOptions: {
        keepAlive: true,
        // When using the keepAlive option, specifies the initial delay for TCP Keep-Alive packets. 
        // Ignored when the keepAlive option is false or undefined.
        keepAliveMsecs: 60000,
        // By default set to 256. For agents with keepAlive enabled, this sets the maximum number of sockets that will be left open in the free state.
        maxFreeSockets: 1,
    },
    // follow HTTP 3xx responses as redirects
    followRedirect: true,
    followAllRedirects: true,
    // keep-alive 
    forever: true,
    // connection pooling
    pool: {
        // maxSockets property can also be provided on the pool object to set the max number of sockets for all agents 
        maxSockets: 1,
    },
    // integer containing number of milliseconds, controls two timeouts
    // Time to wait for a server to send response headers (and start the response body) before aborting the request. 
    // Note that if the underlying TCP connection cannot be established, the OS-wide TCP connection timeout will overrule the timeout option 
    // (the default in Linux can be anywhere from 20-120 seconds).
    // Sets the socket to timeout after timeout milliseconds of inactivity on the socket.
    timeout: 10000,
    // if true, the request-response cycle (including all redirects) is timed at millisecond resolution.
    time: true,
});


/**
 * The utility class to make calls to servers
 */
class ServerCallUtil {
    
    /**
     * HTTP Post using async/await
     * @param {string} url
     * @param {Object} data 
     */
    async postDataAsync(url, data) {
        return await this.postDataPromise(url, data);
    }

    /**
     * HTTP Post with Promise
     * @param {string} url
     * @param {Object} data 
     */
    postDataPromise(url, data) {
        return new Promise((resolve, reject) => {
            let options = Object.assign({}, httpCallOptions);
            options.url = url;
            options.body = data;
            // make another HTTP request
            request.post(options, (err, res, body) => {
                if (err) {
                    console.error(`Error encountered when calling the other server: ${err.body}`);
                    reject({ error: err.body });
                } else {
                    //let json = JSON.parse(body);
                    //console.log(`Got the body from the other server: ${JSON.stringify(body)}`);
                    //console.log(`Response from the other server: ${JSON.stringify(res.body)}`);
                    resolve({ responseData: res.body });
                }
            });
        });
    }

    /**
     * HTTP Post with callback
     * @param {string} url
     * @param {Object} data 
     * @param {Function} callback
     */
    postData(url, data, callback = () => {}) {
        let options = Object.assign({}, httpCallOptions);
        options.url = url;
        options.body = data;
        // make another HTTP request
        request.post(options, (err, res, body) => {
            if (err) {
                console.error(`Error encountered when calling the other server: ${err.body}`);
                callback(err);
            } else {
                //let json = JSON.parse(body);
                //console.log(`Got the body from the other server: ${JSON.stringify(body)}`);
                //console.log(`Response from the other server: ${JSON.stringify(res.body)}`);
                callback(null, res.body);
            }
        });
    }

    /**
     * HTTP Post with callback (persistent connection)
     * @param {string} url
     * @param {Object} data 
     * @param {Function} callback
     */
    postDataPersistentConn(url, data, callback = () => {}) {
        let options = Object.assign({}, httpCallOptions);
        options.url = url;
        options.body = data;
        // make another HTTP request
        persistentRequest.post(options, (err, res, body) => {
            if (err) {
                console.error(`Error encountered when calling the other server: ${err.body}`);
                callback(err);
            } else {
                if (LOG_STATS_INFO) {
                    console.log('request stats');
                    console.log('timingStart:', res.timingStart);
                    console.log('timings:', res.timings);
                    console.log('timingPhases:', res.timingPhases);
                }
                //let json = JSON.parse(body);
                //console.log(`Got the body from the other server: ${JSON.stringify(body)}`);
                //console.log(`Response from the other server: ${JSON.stringify(res.body)}`);
                callback(null, res.body);
            }
        // Event listeners
        // Emitted after a socket is assigned to this request.
        }).on('socket', (socket) => {
            console.log('!!! event!!! socket');
            console.log('socket.connecting:', socket.connecting);
        // Emitted after resolving the hostname but before connecting. Not applicable to UNIX sockets.
        }).on('lookup', (err, address, family, host) => {
            console.log('!!! event!!! lookup');
            if (err) {
                console.error('err:', err);
            } else {
                console.log('address:', address, 'family:', family, 'host:', host);
            }
        // Emitted each time a server responds to a request with a CONNECT method. 
        // If this event is not being listened for, clients receiving a CONNECT method will have their connections closed.
        }).on('connect', (response, socket, head) => {
            console.log('!!! event!!! connect');
            if (LOG_POOL_INFO) {
                console.log('response.request.pool:', response.request.pool);
            }
            console.log('response.request.body:', response.request.body);
        // Emitted when a response is received to this request. This event is emitted only once.
        }).on('response', (response) => {
            console.log('!!! event!!! response');
            if (LOG_POOL_INFO) {
                console.log('response.request.pool:', response.request.pool);
            }
            console.log('response.request.body:', response.request.body);
        // Emitted when the other end of the socket sends a FIN packet, thus ending the readable side of the socket.
        }).on('end', (err, data) => {
            console.log('!!! event!!! end');
        });
    }

} // end class


const serverCallUtil = new ServerCallUtil();
module.exports = serverCallUtil;