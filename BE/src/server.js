require('dotenv').config({ path: '../.env' });

const express = require('express');
const { merge } = require('./helper/crawl_tiki');
const {scrape} = require('./helper/crawl_sendo');
const app = express()
const port = process.env.PORT;
const localhost = process.env.HOST;
const cron = require('node-cron');
const initApiGetProduct = require('./router/api/ApiGetProduct');
const feedbackRouter = require('./router/api/Feedback.js');

//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const testTiki = async () => {
    console.log(await merge())
}

app.use('/api/v1', feedbackRouter)

const testSendo = async () => {
    console.log(await scrape('Điện thoại'))
}

initApiGetProduct(app)

cron.schedule('03 18 * * *', () => {
    console.log('Bắt đầu cào dữ liệu vào lúc 11h');
    //testTiki()
    //testSendo()
});

app.listen(port, localhost, () => {
    console.log(`http://${localhost}:${port}`);
})

