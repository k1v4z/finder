const puppeteer = require('puppeteer');

async function craw() {
    const product = [];
    //open browser
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://tiki.vn/');
    await page.type('[data-view-id="main_search_form_input"]', 'Áo khoác'); //input name of product
    await page.keyboard.press('Enter');
    await page.waitForSelector('.styles__DropDownContainer-sc-1lvexwb-2');
    await page.click('.styles__DropDownContainer-sc-1lvexwb-2'); //only chose best seller 
    await page.waitForSelector('.styles__SortItemWrapper-sc-1pqmdza-1');
    await page.waitForSelector('.cUyUJy .fNqANj');
    await clickSortItem(page);

    for (let i = 1; i <= 2; i++) {
        await goToNextPage(page, i);
        await page.waitForSelector('.product-item');
        await page.waitForNavigation({ waitUntil: 'networkidle0' }); //wait for load url
        const articles = await page.evaluate(() => {
            let titleLinks = document.querySelectorAll('[data-view-id="product_list_item"]');
            titleLinks = [...titleLinks];
            return titleLinks.map((item) => { // Return the object from the callback function
                const name = item.querySelector('.info h3');
                const url = item.getAttribute('href');
                const price = item.querySelector('.price-discount__price').innerText;
                let image = item.querySelector('.webpimg-container source').srcset;

                image = image.split(',');
                image[0] = image[0].split(" ")[0];
                image[1] = image[1].split(" ")[1];
                return { name: name.innerText, url: url, price: price, image: image[1] };
            });
        });

        product.push(articles);
    }


    await browser.close();

    return product
};

async function merge() {
    const productTiki = await craw()

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        for (i = 0; i < productTiki[i].length; i++) {
            for (j = 0; j < productTiki[i].length; j++) {
                if (productTiki[i][j].url.startsWith("//")) {
                    productTiki[i][j].url = `https:${productTiki[i][j].url}`
                } else {
                    productTiki[i][j].url = `https://tiki.vn${productTiki[i][j].url}`
                }

                await page.goto(productTiki[i][j].url)

                const detail = await page.evaluate(() => {
                    const scoreRating = document.querySelector('.styles__StyledReview-sc-1onuk2l-1 div')?.innerText || null;
                    const soldCount = document.querySelector('.styles__StyledQuantitySold-sc-1onuk2l-3')?.innerText || null;

                    return { scoreRating, soldCount }
                })

                //preprocess data

                productTiki[i][j].price = productTiki[i][j].price != null ? Number(productTiki[i][j].price.replace(/[₫.]/g, '')) : null
                productTiki[i][j].score_rating = Number(detail.scoreRating)
                productTiki[i][j].soldCount = detail.soldCount != null ? Number(detail.soldCount.replace('Đã bán ', '')) : null
            }
        }
    } catch (err) {
        console.log(err)
    }

    await browser.close();
    //sort array product
    productTiki.sort(function (a, b) {
        if (a.soldCount !== b.soldCount) {
            return b.soldCount - a.soldCount; // Sort by soldCount in descending order
        } else if (a.score_rating !== b.score_rating) {
            return b.score_rating - a.score_rating; // Sort by score_rating in descending order
        } else {
            return a.price - b.price; // Sort by price in ascending order
        }
    });

    return productTiki
}

async function clickSortItem(page) {
    await page.click('.cUyUJy .fNqANj');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
}

const goToNextPage = async (page, i) => {
    await page.waitForSelector(`[data-view-label="${i}"]`);
    await page.click(`[data-view-label="${i}"]`);
}

module.exports = { merge }



