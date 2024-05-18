const puppeteer = require('puppeteer');
const tikiProduct = require('../service/CrawlTiKi/GetTikiProduct');

async function craw(nameOfProduct) {
    const product = [];
    //open browser
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://tiki.vn/');
    await page.type('[data-view-id="main_search_form_input"]', nameOfProduct); //input name of product
    await page.keyboard.press('Enter');
    await page.waitForSelector('.styles__DropDownContainer-sc-1lvexwb-2');
    await page.click('.styles__DropDownContainer-sc-1lvexwb-2'); //only chose best seller 
    await page.waitForSelector('.styles__SortItemWrapper-sc-1pqmdza-1', { timeout: 5000 });
    await page.waitForSelector('.cUyUJy .fNqANj');
    await clickSortItem(page);

    for (let i = 1; i <= 5; i++) { //only get product in 5 pages
        await goToNextPage(page, i);
        await page.waitForSelector('.product-item');
        await page.waitForNavigation({ waitUntil: 'load', timeout: 0 }); //wait for load url
        const articles = await page.evaluate(() => {
            let titleLinks = document.querySelectorAll('[data-view-id="product_list_item"]');
            titleLinks = [...titleLinks];
            return titleLinks.map((item) => { // Return the object from the callback function
                const name = item.querySelector('.info h3');
                const url = item.getAttribute('href');
                let price = item.querySelector('.price-discount__price').innerText;
                if (typeof price === undefined) {
                    price = item.querySelector('product-price__current-price').innerText
                }
                let image = item.querySelector('.webpimg-container source').srcset;

                image = image.split(',');
                image[0] = image[0].split(" ")[0];
                image[1] = image[1].split(" ")[1];
                return {
                    name: name.innerText,
                    url: url,
                    price: price,
                    image: image[1],
                    type: 'Tiki',
                    products_name: nameOfProduct
                };
            });
        });
        for (i = 0; i < articles.length; i++) {
            const article = articles[i]
            product.push(article)
        }
    }


    await browser.close();

    return product
};

async function merge(nameOfProduct) { //merge price,score rating with product
    const productTiki = await craw(nameOfProduct)

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        for (i = 0; i < productTiki.length; i++) {
            if (productTiki[i].url.startsWith("//")) {
                productTiki[i].url = `https:${productTiki[i].url}`
            } else {
                productTiki[i].url = `https://tiki.vn${productTiki[i].url}`
            }

            await page.goto(productTiki[i].url)

            const detail = await page.evaluate(() => {
                const scoreRating = document.querySelector('.styles__StyledReview-sc-1onuk2l-1 div')?.innerText || null;
                const soldCount = document.querySelector('.styles__StyledQuantitySold-sc-1onuk2l-3')?.innerText || null;

                return { scoreRating, soldCount }
            })

            //preprocess data
            productTiki[i].price = Number(productTiki[i].price.replace(/[₫.]/g, ''));
            productTiki[i].score_rating = Number(detail.scoreRating)
            productTiki[i].soldCount = detail.soldCount != null ? Number(detail.soldCount.replace('Đã bán ', '')) : null
        }
    } catch (err) {
        console.log(err)
    }

    await browser.close();
    //sort array product
    productTiki.sort(compare)

    return [productTiki[0], productTiki[1], productTiki[2]]
}

function compare(a, b) {
    if (a.score_rating > b.score_rating) {
        return -1;
    }
    if (a.score_rating < b.score_rating) {
        return 1;
    }

    // Nếu đánh giá bằng nhau, so sánh theo giá (price) tăng dần
    if (a.price < b.price) {
        return -1;
    }
    if (a.price > b.price) {
        return 1;
    }

    // Nếu giá bằng nhau, so sánh theo số lượng đã bán (soldCount) giảm dần
    if (a.soldCount > b.soldCount) {
        return -1;
    }
    if (a.soldCount < b.soldCount) {
        return 1;
    }

    // Nếu cả ba tiêu chí đều bằng nhau, giữ nguyên thứ tự
    return 0;
}

async function clickSortItem(page) {
    await page.click('.cUyUJy .fNqANj');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
}

const goToNextPage = async (page, i) => {
    await page.waitForSelector(`[data-view-label="${i}"]`);
    await page.click(`[data-view-label="${i}"]`);
}

module.exports = { merge }



