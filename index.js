const express = require('express');
const request = require('request');

const app = express();
const PORT = 3000;

// middlewares to help process HTTP requests
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world!!!');
});

app.get('/route/userId/:userId/name/:name', (req, res) => {
    const data = req.params;
    console.log('Got the request parameters from the user request');
    console.log(data);

    // options for the HTTP call to the other server
    const options = {  
        url: 'http://localhost:3001/route',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        },
        //body: A Buffer, String, or Stream object (can be an object if json option is set to true)
        json: true,
        body: data
    };
    // make another HTTP request
    request.post(options, (err, res, body) => {
        if (err) {
            console.error(`Error encountered when calling the other server: ${err.body}`);
        } else {
            //let json = JSON.parse(body);
            console.log(`Got the body from the other server: ${body}`);
            console.log(`Response from the other server: ${res.body}`);
        }
    });

    res.end();
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});