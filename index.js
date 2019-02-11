const express = require('express');
const request = require('request');

const Container = require('./containerClass');
const serverCallUtil = require('./serverCallUtil');


const app = express();
const PORT = 3000;


let msgId = 0;


// middlewares to help process HTTP requests
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world!!!');
});

app.get('/route/userId/:userId/name/:name', async (req, res) => {
    const data = {};
    data.test = 'test';

    console.log('Got the request parameters from the user request');
    // store the request parameters
    data.userId = req.params.userId;
    data.name = req.params.name;

    // store the function
    data.func = function() {
        console.log('This is a func');
    }
    
    ++msgId;
    let containerObj = new Container(data.userId, data.name, msgId, `Message id: ${msgId}`);
    // store the member function to be passed as a parameter
    data.getIdFunc = containerObj.getId;
    data.getNameFunc = containerObj.getName;
    // store the entire object
    data.containerObj = containerObj;
    
    console.log(data);

    // options for the HTTP call to the other server
    const url = 'http://localhost:3001/route';

    /////////////////////////////////////////////////
    // HTTP post request using callback
    serverCallUtil.postData(url, data, (err, resData) => {
        if (err) {
            console.error('===== Got the error through callback');
            console.error(err);
        } else {
            console.log('===== Got the response data through callback');
            console.log(resData);
        }
    });

    /////////////////////////////////////////////////
    // HTTP post request (using Promise)
    serverCallUtil.postDataPromise(url, data).then(resData => {
        console.log('===== Got the response data from the promise');
        console.log(resData);
    }).catch(err => {
        console.error('===== Got the error from the promise');
        console.error(err);
    });

    /////////////////////////////////////////////////
    // async func
    try {
        // HTTP post request
        const resData = await serverCallUtil.postDataAsync(url, data);
        console.log('===== Got the response data from the async function');
        console.log(resData);
    } catch (err) {
        console.error('===== Got the error from the async function');
        console.error(err);
    }

    // to illustrate callback, promise and async approaches when making the HTTP call to the other server, 
    // I purposefully did not use Promise.all to wait for all async process to complete before sending back the response
    // instead, I opt to use a timeout (just as an example)
    setTimeout(() => {
        res.end();
    }, 5000);
});

app.get('/redirectRoute/userId/:userId/name/:name', async (req, res) => {
    const data = {};
    data.test = 'test';

    console.log('Got the request parameters from the user request');
    // store the request parameters
    data.userId = req.params.userId;
    data.name = req.params.name;

    // store the function
    data.func = function() {
        console.log('This is a func');
    }
    
    ++msgId;
    let containerObj = new Container(data.userId, data.name, msgId, `Message id: ${msgId}`);
    // store the entire object
    data.containerObj = containerObj;
    
    console.log(data);

    // options for the HTTP call to the other server
    const url = 'http://localhost:3001/redirect';

    /////////////////////////////////////////////////
    // HTTP post request using callback (perisistent connection)
    serverCallUtil.postDataPersistentConn(url, data, (err, resData) => {
        if (err) {
            console.error('===== Got the error through callback');
            console.error(err);
        } else {
            console.log('===== Got the response data through callback');
            console.log(resData);
        }

        res.end();
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

