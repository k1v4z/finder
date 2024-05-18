require('dotenv').config({ path: '../.env' });

const express = require('express');
const { merge } = require('./helper/crawl_tiki');
const {scrape} = require('./helper/crawl_sendo');
const app = express()
const port = process.env.PORT;
const localhost = process.env.HOST;
const initApiGetProduct = require('./router/api/ApiGetProduct');
const feedbackRouter = require('./router/api/Feedback.js');
const setupCron = require('./service/CronService');

//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/feedback', feedbackRouter);
setupCron()
initApiGetProduct(app)

app.listen(port, localhost, () => {
    console.log(`http://${localhost}:${port}`);
})

