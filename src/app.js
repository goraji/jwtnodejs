require ('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = 8000;
require('./db/conn');
app.use(express.json());
const uploads = path.join(__dirname,"./uploads")
// console.log(uploads);
app.use(express.static(uploads));

const router = require('./routes/router');
app.use(router);
app.listen(port, () => {
    console.log(`runnning at ${port}`);
})