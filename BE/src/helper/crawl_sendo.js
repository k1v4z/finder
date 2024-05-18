const puppeteer = require('puppeteer');
// Delay the execution of a function by the specified time.
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Launch a browser instance using Puppeteer.
async function launchBrowser() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null, // Add this line
        args: ['--start-maximized'] // Add this line to start browser maximized
    });
    return browser;
}
// Create a new page in the given browser instance.
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
/**
 * main function to scrape the data from sendo.vn
 * @param {string} searchContent - The content to search for on sendo.vn (this should be get from the ProductCrawl.json file)
 * @returns {Promise<Array>} An array of products scraped from sendo.vn
 * export this function to use in other files
 */
async function scrape(searchContent) {
    console.log('Starting...');
    const browser = await launchBrowser();
    const page = await createPage(browser);
    // Go to the searched page
    page.goto(`https://www.sendo.vn/tim-kiem?q=${searchContent.toLowerCase()}`, { timeout: 30000 });
    console.log('Scraping data...');
    const rawProducts = await scrapePage(page);
    console.log('Data has been scraped!');
    // Process the data to the desired format
    const products = processProductData(rawProducts);
    sortProducts(products);
    await browser.close();
    return products.slice(0, 3); // Get the top 3 products
}
// Scroll to the bottom of the product page
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
// Scrape the page
async function scrapePage(page) {
    try {
        await page.waitForNavigation({waitUntil: 'networkidle0', timeout: 15000})
    } catch {
        await page.reload();
        await delay(1000)
    }
    // click with a delay of 500ms
    await page.click('.d7ed-tV3JH6 span', { delay: 500 });
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


const productsData = async (page) => {
    let items = await page.$$('._0337-BT20Ke.d7ed-OoK3wU a');
    let hrefs = []

    // First, scrape all the hrefs
    for (let item of items) {
        const href = await page.evaluate(el => el?.getAttribute('href') || null, item);
        hrefs.push(href);
    }

    let products = []
    // Then, go to each href to scrape product details
    for (let href of hrefs) {
        await page.goto(href.split('html')[0] + 'html');
        let productDetail = await getProductDetails(page)
        console.log(productDetail)
        if (productDetail !== null) {
            products.push(productDetail);
        }

    }
    return products;
}
// Get the raw product details
const getProductDetails = async (page) => {
    // Wait for the page to load
    await delay(1500);
    // await page.waitForNavigation({waitUntil: 'networkidle0', timeout: 15000});
    try {
        // Scroll down the page
        await page.keyboard.press('PageDown');
        // Address
        await page.waitForSelector('.e7be-T_5cki', { visible: true, timeout: 5000 });
        
    } catch {
        // Refresh the page if cannot get those selectors
        await page.reload();
        await delay(1500);
        await page.keyboard.press('PageDown');
    }
    // After press page down, wait for 1000ms
    await delay(500);
    const data = await page.evaluate(() => ({
        // Product image URL (this have to not be null)
        imageURL: document.querySelector('.d7ed-a1ulZz img')?.getAttribute('src') || null,
        // The name of the product (this have to not be null)
        name: document.querySelector('h1')?.innerText,
        // Product price (this have to not be null)
        price: document.querySelector(`#main > div.d7ed-IB_g3V.d7ed-NsreHf._36fd-qAyq2p > div:nth-child(3) 
            > div._36fd-qUkp3A.d7ed-OoK3wU.d7ed-E1SUA2.d7ed-MTc6d2.d7ed-P1dAZs.d7ed-giRxgK > div.d7ed-IB_g3V._3141-sPiIwu 
            > div._3141-uvnWHO > div._3141-j_1grA.d7ed-fdSIZS.d7ed-OoK3wU.d7ed-UkcyG6 > span`)?.innerText,
        // Product sold count
        soldCount: document.querySelector(`#main > div.d7ed-IB_g3V.d7ed-NsreHf._36fd-qAyq2p > div:nth-child(3) 
            > div._36fd-qUkp3A.d7ed-OoK3wU.d7ed-E1SUA2.d7ed-MTc6d2.d7ed-P1dAZs.d7ed-giRxgK > div.d7ed-IB_g3V._3141-sPiIwu > div._3141-uvnWHO 
            > div._3141-krBUQR.d7ed-fdSIZS.d7ed-UkcyG6 > span`)?.innerText || null,
        // Product score rating
        scoreRating: document.querySelector('._39ab-k3Gyep > div span')?.innerText || null,
        // Number of reviews
        reviews: document.querySelector('._39ab-EfDooz span')?.innerText || null,
        // Product address (this have to not be null)
        address: document.querySelector(`.e7be-T_5cki`)?.innerText || null
    }));
    // return the data
    if (data.address === null) {
        return null;
    }
    return { href: page.url(), ...data, type: 'Sendo' }
}
// Preprocess the data
function processProductData(data) {
    return data.map(product => {
        return {
            href: product.href ? processHref(product.href) : null, //this is the product detail link (string)
            imageURL: product.imageURL || null, //this is the product image URL (string)
            name: product.name || null, //this is the name of the product (string)
            price: product.price ? processPrice(product.price) : 0,
            soldCount: product.soldCount ? processSoldCount(product.soldCount) : 0,
            scoreRating: product.scoreRating ? processScoreRating(product.scoreRating) : null, // Null because some product get 0 score
            reviews: product.reviews ? processReviews(product.reviews) : null, // Null because some product's review not available
            address: product.address ? processAddress(product.address) : null
        };
    });

}
/**
* [product href].html?[]
* we just need the product href, so we split the string by '.html' and get the first element of the array
* example: https://www.sendo.vn/duoc-xem-hang-anh-that-quan-dui-tay-au-nam-loai-dep-vai-day-tre-trung-20007167.html?source_block_id=feed&source_page_id=search&source_info=desktop2_60_1715362450893_99c836c0-0df9-439c-acf5-c118906eeef5_-1_cateLvl2_0_240_23_-1
* result: https://www.sendo.vn/duoc-xem-hang-anh-that-quan-dui-tay-au-nam-loai-dep-vai-day-tre-trung-20007167.html
*/
function processHref(href) {
    return href.split('html')[0] + 'html'; //this is the product detail link (string)
}
/**
 * case 1: [price.]đ (124.000đ)
 * we just need the price, so we replace all non-digit characters with an empty string -> 124000
 * case 2: [price.]đ - [price.]đ (321.000đ - 463.000đ)
 * this is the bound of price, so we just need the first price -> 321000
 */
function processPrice(price) {
    const firstPrice = price.split('-')[0];
    return parseInt(firstPrice.replace(/\D/g, ''));
}
/**
 * Đã bán [sold count]
 * we just need the sold count, so we replace 'đã bán ' with an empty string
 */
function processSoldCount(soldCount) {
    let count = soldCount.replace(/^\D+/g, '');
    if (count.endsWith('K')) {
        count = parseFloat(count.replace('K', '')) * 1000;
    } else {
        count = count.replace(/\D/g, '');
    }
    return parseInt(count);
}
/**
 * [score]/[5]
 * we just need the score, so we split the string by '/' and get the first element of the array
 */
function processScoreRating(scoreRating) {
    return parseFloat(scoreRating);
}
// just get the number of reviews
function processReviews(reviews) {
    return parseInt(reviews.replace(/\D/g, ''));
}
/**
 * [shop]\n[address] | [star]
 * we split the address by '\n'
 * then we split the address by '|' and return
 */
function processAddress(address) {
    let parts = address.split('\n');
    if (parts.length > 1) {
        return parts[1].split('|')[0].trim();
    } else {
        return parts[0].split('|')[0].trim();
    }
}

function sortProducts(products) {
    products.sort(function (a, b) {
        if (a.soldCount !== b.soldCount) {
            return b.soldCount - a.soldCount; // Sort by soldCount in descending order
        } else if (a.scoreRating !== b.scoreRating) {
            return b.scoreRating - a.scoreRating; // Sort by score_rating in descending order
        } else {
            return a.price - b.price; // Sort by price in ascending order
        }
    });
}

module.exports = {scrape}