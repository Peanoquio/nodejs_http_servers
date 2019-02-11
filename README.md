# nodejs_http_servers
A NodeJS sample to show how a server makes a HTTP request to another server

## Usage

To run a sample of how this works:
* Run `npm install`
* Run both servers by typing these on the command line: `node index.js` (port 3000) and `node otherServer.js` (port 3001)
* On the server with port 3000, you can make a HTTP request by typing this URL on the browser
```
http://localhost:3000/route/userId/123/name/guesswho
```
* On the same server with port 3000, you can also call this endpoint. The other server (having port 3001)--after receiving the request--will do a redirect to itself with a new endpoint before sending back the response to the calling server. 
Moreover, the HTTP connection for this will be persistent (with keep-alive and connection pooling).
```
http://localhost:3000/redirectRoute/userId/123/name/guesswho
```
* If you look at the console, you will see that the request is routed to the other server--which in turn also sends a response back to the calling server (that initially made the request)
* As an alternative, you can also install `wrk` and make multiple requests to the server. This command line tool is useful for a more detailed benchmarking when making requests.
```
wrk -t1 -c1 -d1s http://localhost:3000/redirectRoute/userId/123/name/guesswho
```

## Dependencies

The servers uses Express and Request NodeJS modules

## License

This is an open source project under the MIT license.  For more information, please refer to [license.txt](license.txt) 
