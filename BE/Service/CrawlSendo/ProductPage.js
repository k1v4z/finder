/**
 * this file is responsible for scraping data from a specific page.
 */
const productsData = require('./ScrapeData.js');
const { delay } = require('./Utils.js');
/**
 * Scrapes data from a specific page.
 * @param {Page} page - The Puppeteer page object.
 * @param {string} searchedURL - The base URL of the page.
 * @param {number} pageNumber - The page number to scrape.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether there is a next page.
 */


async function scrollToTheBottom(page) {
    await page.evaluate(async () => {
        // while the scroll bar is not at the bottom of the page
        while (document.documentElement.scrollTop + window.innerHeight < document.documentElement.scrollHeight) {
            // Scroll down 500 pixels
            window.scrollBy(0, 500);
            // like the delay function, but we can't use delay here because this is inside the browser
            // so we need to use the setTimeout function
            // wait for 100ms
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    });
    await delay(500);
}


async function scrapePage(page) {
    await delay(2000);
    // click with a delay of 500ms
    await page.click('.d7ed-tV3JH6 span', { delay: 1000 });
    //wait for the best seller option in the dropdown list
    await page.waitForSelector('#sds-popper > div > div > div > ul > li:nth-child(2) > a > span', { visible: true });
    await Promise.all([
        //click the best seller option in the dropdown list
        page.click('#sds-popper > div > div > div > ul > li:nth-child(2) > a > span'),
        //wait for the page to navigate to the best seller page
        page.waitForNavigation()
    ]);
    //start scrapping all the data
    const data = []
    await delay(1000);
    // Scroll to the bottom of the page
    await scrollToTheBottom(page);
    //save the data scraped from the page
    let products = await productsData(page);
    data.push(...products);
    return data;

}
module.exports = scrapePage;
