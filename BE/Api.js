const express = require('express');
const app = express();

const { getBestProducts } = require('./src/service/CrawlSendo/DataProcessing.js');
const fs = require('fs');

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/searching-result', async (req, res) => {
    const searchContent = req.body.search;
    const filePath = `./src/Service/CrawlSendo/data/${searchContent.toLowerCase()}.json`;
    
    if (fs.existsSync(filePath)) {
        const bestProducts = await getBestProducts(filePath);
        res.json(bestProducts);
    } else {
        res.status(404).send('Not found');
    }

});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});