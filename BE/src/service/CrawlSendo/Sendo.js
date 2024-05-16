
const { launchBrowser, createPage } = require('./Utils.js');
const scrapePage = require('./ProductPage.js');
const { sortProducts, processProductData, saveData } = require('./DataProcessing.js');
// Crawl the data from sendo.vn
async function scrape() {
    try {
        // Launch the browser and create a new page, go to the homepage
        console.log('Starting...');
        const browser = await launchBrowser();
        const page = await createPage(browser);
        const searchContent = 'giày thể thao nam';
        page.goto(`https://www.sendo.vn/tim-kiem?q=${searchContent.toLowerCase()}`, { timeout: 30000 });
        // Start scraping from the searched page
        console.log('Scraping data...');
        const rawProducts = await scrapePage(page);
        console.log('Data has been scraped!');
        // Process the data
        console.log('Processing data...');
        // Process the data to the desired format
        const products = processProductData(rawProducts);
        // Sort the products by sold count, score rating, and price before saving
        sortProducts(products);
        // Save the data to a JSON file with the searched content as the name
        saveData(products, searchContent);
        //console.log(products)
        console.log('The scraped data has been saved!');
        console.log('Done!');
    } catch(err) {
        console.log(err);
    }

}
scrape().catch(console.error);

module.exports = scrape;