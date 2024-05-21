const cron = require('node-cron');
const { readData, clearData } = require('./JsonFileService');
const { merge } = require('../helper/crawl_tiki.js');
const setProduct = require('./CrawlTiKi/SetTikiProduct');
const { scrapeSendo } = require('../helper/crawl_sendo.js');

const crawlTiki = async (name) => {
    console.log(`Start Tiki Crawling ${name}`)
    const data = await merge(name)
    
    for(product of data){
        await setProduct(product)
    }
}

const crawlSendo = async (name) => {
    console.log(`Start Sendo Crawling ${name}`)
    const products = await scrapeSendo(name)

    for(product of products){
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
        const name = names[i];
        await crawlTiki(name)
        await crawlSendo(name)

        // await Promise.all([crawlTiki(name),crawlSendo(name)])
        // .catch(err => console.log(err))
    }

    //after crawl finish delete all 
    clearData()
}


const setupCron = () => {
    cron.schedule('32 08 * * *', () => { //crawling data at 11h PM every day
        const names = getProductCrawl() //name of product must crawl
        crawlAllData(names)
    })
}

const getProductCrawl = () => { //crawl product don't exist in database
    const nameOfProduct = readData()
    return JSON.parse(nameOfProduct).name
}

module.exports = setupCron