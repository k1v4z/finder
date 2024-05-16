
const puppeteer = require('puppeteer');
/**
 * Delays the execution of a function by the specified time.
 * @param {number} ms - The time to delay in milliseconds.
 * @returns {Promise} A promise that resolves after the specified time.
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Launches a browser instance using Puppeteer.
 * @returns {Promise<import('puppeteer').Browser>} The Puppeteer browser instance.
 */
async function launchBrowser() {
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null, // Add this line
        args: ['--start-maximized'] // Add this line to start browser maximized
    });
    return browser;
}
/**
 * Creates a new page in the given browser instance.
 * @param {import('puppeteer').Browser} browser - The browser instance.
 * @returns {Promise<import('puppeteer').Page>} The newly created page.
 */
async function createPage(browser) {
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    });
    //Block images, fonts, and stylesheets
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        // Abort requests for certain resource types
        if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font') {
            req.abort();
        }
        else {
            req.continue();
        }
    });
    return page;
}
module.exports = { launchBrowser, createPage, delay }; //export the browser and page objects