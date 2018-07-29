const express = require('express');
const request = require('request');

const Container = require('./containerClass');


const app = express();
const PORT = 3000;

// middlewares to help process HTTP requests
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world!!!');
});

app.get('/route/userId/:userId/name/:name', (req, res) => {
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
    
    let containerObj = new Container(data.userId, data.name);
    // store the member function to be passed as a parameter
    data.getIdFunc = containerObj.getId;
    data.getNameFunc = containerObj.getName;
    // store the entire object
    data.containerObj = containerObj;
    
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

    /////////////////////////////////////////////////
    // HTTP post request using callback
    postData(options, (err, resData) => {
        if (err) {
            console.error('Got the error through callback');
            console.error(err);
        } else {
            console.log('Got the response data through callback');
            console.log(resData);
        }
    });

    /////////////////////////////////////////////////
    // HTTP post request (using Promise)
    postDataPromise(options).then(resData => {
        console.log('Got the response data from the promise');
        console.log(resData);
    }).catch(err => {
        console.error('Got the error from the promise');
        console.error(err);
    });

    /////////////////////////////////////////////////
    // async func
    try {
        // HTTP post request
        const resData = postDataAsync(options);
        console.log('Got the response data from the async function');
        console.log(resData);
    } catch (err) {
        console.error('Got the error from the async function');
        console.error(err);
    }

    res.end();
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});


/////////////////////////////////////////////////////////////////////////////////////////////

/**
 * HTTP Post using async/await
 * @param {*} options 
 */
const postDataAsync = async (options = {}) => {
    return await postDataPromise(options);
};

/**
 * HTTP Post with Promise
 * @param {Object} options 
 */
const postDataPromise = (options = {}) => {
    return new Promise((resolve, reject) => {
        // make another HTTP request
        request.post(options, (err, res, body) => {
            if (err) {
                console.error(`Error encountered when calling the other server: ${err.body}`);
                reject({ error: err.body });
            } else {
                //let json = JSON.parse(body);
                console.log(`Got the body from the other server: ${body}`);
                console.log(`Response from the other server: ${res.body}`);
                console.log(res.body);
                resolve({ responseData: res.body });
            }
        });
    });
};

/**
 * HTTP Post with callback
 * @param {Object} options 
 * @param {Function} callback
 */
const postData = (options = {}, callback = () => {}) => {
    // make another HTTP request
    request.post(options, (err, res, body) => {
        if (err) {
            console.error(`Error encountered when calling the other server: ${err.body}`);
            callback(err);
        } else {
            //let json = JSON.parse(body);
            console.log(`Got the body from the other server: ${body}`);
            console.log(`Response from the other server: ${res.body}`);
            console.log(res.body);
            callback(null, res.body);
        }
    });
};