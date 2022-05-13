const express = require('express')
const route = require('./routes/authRoute')

const app = express()
// const port = 3001
const port = process.env.PORT || 8080;

app.use(express.json())

const cors=require("cors");
const corsOptions ={
    origin:'*',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});

app.use('/api', route)
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
