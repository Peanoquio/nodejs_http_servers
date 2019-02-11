const express = require('express');
const url = require('url');
const http = require('http');

const app = express();
const PORT = 3001;


// simple token that will update at intervals
// this is not used but just passed around
// TODO: use a HTTP session instead
let dynamicToken = 1;
setInterval(() => {
    ++dynamicToken;
}, 10 * 1000);


// create the HTTP server
const server = http.createServer(app);
server.keepAliveTimeout = 30 * 1000;


// middlewares to help process HTTP requests
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from the other world!!!');
});

app.post('/route', (req, res) => {
    const data = req.body;
    console.log('Got the routed data for path: route');
    console.log(data);

    // NOTE: the functions are not being passed through the HTTP request from the calling server
    //console.log(`The value from getId function: ${data.containerObj.getIdFunc()}`);
    //console.log(`The value from getName function: ${data.containerObj.getNameFunc()}`);

    res.json( { msg: 'The other server got the routed data', containerObj: data.containerObj });
}); 

// redirect to a new route
app.post('/redirect', (req, res) => {
    const data = req.body;
    console.log('Got the routed data for path: redirect');
    console.log(data);
    /*
    HTTP 307 Temporary Redirect redirect status response code indicates that the resource requested 
    has been temporarily moved to the URL given by the Location headers.
    The method and the body of the original request are reused to perform the redirected request
    The only difference between 307 and 302 is that 307 guarantees that the method and the body 
    will not be changed when the redirected request is made.
    */
    res.redirect(307, url.format({
        pathname: `/newroute`,
        query: {
            token: dynamicToken
        }
    }));
    // this will work too
    //res.set('location', `http://localhost:${PORT}/newroute`);
    //res.status(307).send();
});

let newRouteReqCounter = 0;
// the new route using a dynamic token for its path
app.post(`/newroute`, (req, res) => {
    const data = req.body;
    const query = req.query;
    console.log('REDIRECTED to path: newroute with dynamicToken:', dynamicToken);
    console.log('Got the routed request body');
    console.log(data);
    console.log('Got the routed request query');
    console.log(query);

    // append the token to the container
    data.containerObj.token = query.token;

    ++newRouteReqCounter;
    console.log(`>>>>> newRouteReqCounter: ${newRouteReqCounter}`);

    res.json({ msg: 'The other server got the routed data', containerObj: data.containerObj });
}); 

app.get('/resetnewroutecounter', (req, res) => {
    newRouteReqCounter = 0;
    res.send('newroute request counter has been reset');
});

server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

// event listeners
// This event is emitted when a new TCP stream is established. socket is typically an object of type net.Socket.
server.on('connection', (socket) => {
    console.log('----- A connection was made by a client!!!');
});

// Emitted each time there is a request. Note that there may be multiple requests per connection (in the case of HTTP Keep-Alive connections).
server.on('request', (req, res) => {
    console.log('----- A request was made by a client!!!');
});