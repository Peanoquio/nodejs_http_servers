const express = require('express');

const app = express();
const PORT = 3001;

// middlewares to help process HTTP requests
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from the other world!!!');
});

app.post('/route', (req, res) => {
    const data = req.body;
    console.log('Got the routed data');
    console.log(data);
    console.log(`Routed data --- userId:${data.userId} name:${data.name}`);
    res.send(`The other server got the routed data`);
}); 

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});