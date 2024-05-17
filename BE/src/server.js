require('dotenv').config({ path: '../.env' });

const express = require('express');
const { merge } = require('./helper/craw_tiki');
const app = express()
const port = process.env.PORT;
const localhost = process.env.HOST;
const cron = require('node-cron');
const initApiGetProduct = require('./router/api/ApiGetProduct');

//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const test = async () => {
    console.log(await merge())
}

initApiGetProduct(app)

cron.schedule('35 21 * * *', () => {
    console.log('Bắt đầu cào dữ liệu vào lúc 11h');
    test()
});

app.listen(port, localhost, () => {
    console.log(`http://${localhost}:${port}`);
})

