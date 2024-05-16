const { delay } = require('./Utils.js');

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
        /**
        * [product href].html?[]
        * we just need the product href, so we split the string by '.html' and get the first element of the array
        * example: https://www.sendo.vn/duoc-xem-hang-anh-that-quan-dui-tay-au-nam-loai-dep-vai-day-tre-trung-20007167.html?source_block_id=feed&source_page_id=search&source_info=desktop2_60_1715362450893_99c836c0-0df9-439c-acf5-c118906eeef5_-1_cateLvl2_0_240_23_-1
        * result: https://www.sendo.vn/duoc-xem-hang-anh-that-quan-dui-tay-au-nam-loai-dep-vai-day-tre-trung-20007167.html
        */
        await page.goto(href.split('html')[0] + 'html');
        let productDetail = await getProductDetails(page)
        console.log(productDetail)
        if (productDetail !== null) {
            products.push(productDetail);
        }

    }
    return products;
}

const getProductDetails = async (page) => {
    await delay(1000); // delay 1500ms to wait the page load
    try {
        // If can not get the address element, refresh the page
        await page.waitForSelector('.e7be-T_5cki'.innerText, { visible: true, timeout: 3000 });
    } catch (error) {
        await page.reload();
        await delay(1000);
    }
    await page.keyboard.press('PageDown');
    await delay(1000)
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
    if(data.address === null) {
        return null;
    }
    return { href: page.url(), ...data }
}

module.exports = productsData;