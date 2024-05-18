const cron = require('node-cron');
const { readData } = require('./JsonFileService');
const { merge } = require('../helper/crawl_tiki.js');
const setProduct = require('./CrawlTiKi/SetTikiProduct');

const crawl = async (name) => {
    console.log(`Start Crawling ${name}`)
    const data = await merge(name)

    for(product of data){
        await setProduct(product)
    }
}

async function crawlAllData(names) {
    // Create an array from name of product
    // const promises = names.map(name => crawl(name));
    // // Wait for all promises complete
    // await Promise.all(promises)
    //     .then(res => console.log("Crawling completed ------>", res))
    //     .catch(err => console.log('Crawl error ------->', err))
    for (let i = 0; i < names.length; i++) {
        const name = names[i]
        await crawl(name)
    }
}


const setupCron = () => {
    cron.schedule('31 08 * * *', () => { //crawling data at 11h PM every day
        const names = getProductCrawl() //name of product must crawl
        crawlAllData(names)
    })
}

const getProductCrawl = () => { //crawl product don't exist in database
    const nameOfProduct = readData()
    return JSON.parse(nameOfProduct).name
}

module.exports = setupCron