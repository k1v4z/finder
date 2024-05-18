require('dotenv').config({ path: '../.env' });

const express = require('express');
const { merge } = require('./helper/craw_tiki');
const app = express()
const port = process.env.PORT;
const localhost = process.env.HOST;
const initApiGetProduct = require('./router/api/ApiGetProduct');
const setupCron = require('./service/CronService');

//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupCron()
initApiGetProduct(app)

app.listen(port, localhost, () => {
    console.log(`http://${localhost}:${port}`);
})

