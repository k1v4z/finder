const fs = require('fs');

//preprocess the data
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

function getBestProducts(filePath) {
    const products = readData(filePath);
    return products.slice(0, 3); // Get the top 3 products
}

function readData(filePath) {
    try {
        let data = fs.readFileSync(filePath, 'utf8');
        if (data.trim() === '') {
            return [];
        }
        return JSON.parse(data);
    }
    catch (err) {
        console.log('File ' + filePath + ' is not found.');
        console.log('Creating a new file ' + filePath);
        return [];
    }
}
// Save the data to a JSON file
function saveData(newProducts, fileName) {
    // Read the existing products from the file
    const products = readData('data/' + fileName);
    // Create a map of the existing products
    const productsMap = products.reduce((map, product) => {
        map[product.href] = product;
        return map;
    }, {});
    // Update the existing products with the new products
    try {
        newProducts.forEach(newProduct => {
            if (!productsMap.hasOwnProperty(newProduct.href)) {
                // Add the new product to the products array and map
                products.push(newProduct);
                productsMap[newProduct.href] = newProduct;
            } else {
                // Update the existing product
                let existingProduct = productsMap[newProduct.href];
                if (JSON.stringify(existingProduct) !== JSON.stringify(newProduct)) {
                    let index = products.indexOf(existingProduct);
                    products[index] = newProduct;
                    productsMap[newProduct.href] = newProduct;
                }
            }
        });
    }
    catch (err) {
        console.error(err);
    }
    finally {
        fs.writeFileSync('data/' + fileName + '.json', JSON.stringify(products, null, 2));
    }
}


module.exports = { sortProducts, processProductData, saveData, getBestProducts };