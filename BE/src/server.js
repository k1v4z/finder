require('dotenv').config({ path: '../.env' });

const express = require('express');
const { merge } = require('./helper/crawl_tiki');
const {scrape} = require('./helper/crawl_sendo');
const app = express()
const port = process.env.PORT;
const localhost = process.env.HOST;
const {initApiGetProduct, getSendoProductApi} = require('./router/api/ApiGetProduct');
const submitFeedback = require('./router/api/Feedback.js');
const setupCron = require('./service/CronService');

//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupCron()
submitFeedback(app)
initApiGetProduct(app)
getSendoProductApi(app)

app.listen(port, localhost, () => {
    console.log(`http://${localhost}:${port}`);
})

