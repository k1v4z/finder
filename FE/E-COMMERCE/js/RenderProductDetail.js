import { getTikiProduct, getSendoProduct } from "./RenderProductView.js";
const urlParams = new URLSearchParams(window.location.search);
const products_name = urlParams.get('name');
const type = urlParams.get('type');
const listItems = document.querySelector('.items');
let listItemsHTML = '';

async function render() {
    let products = []
    if (type == 'Tiki') {
        products = await getTikiProduct();
        products.forEach((product) => {
            listItemsHTML += `
            <div class="item1" onclick="window.location.href='${product.url}'">
                <div class="product-info">
                    <img src="${product.image}" alt="Product 1" class="product-img">
                    <p class="t-op-nextlvl">${product.name}</p>
                </div>
                <h3 class="t-op-nextlvl">${product.score_rating} / 5</h3>
                <h3 class="t-op-nextlvl">${product.soldCount}</h3>
                <h3 class="t-op-nextlvl">${formatPrice(product.price)}</h3>
            </div>
        `
        })
    } else {
        products = await getSendoProduct();

        products.forEach((product) => {
            if (!product.scoreRating) {
                product.scoreRating = 0
            }
            listItemsHTML += `
            <div class="item1" onclick="window.location.href='${product.href}'">
                <div class="product-info">
                    <img src="${product.imageURL}" alt="Product 1" class="product-img">
                    <p class="t-op-nextlvl">${product.name}</p>
                </div>
                <h3 class="t-op-nextlvl">${product.scoreRating} / 5</h3>
                <h3 class="t-op-nextlvl">${product.soldCount}</h3>
                <h3 class="t-op-nextlvl">${formatPrice(product.price) }</h3>
            </div>
        `
        })
    }

    if (type == 'Sendo') {
        products = await getSendoProduct();
    }


    listItems.innerHTML = listItemsHTML

}

const formatPrice = (price) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,  // VND typically doesn't use fractional currency
        maximumFractionDigits: 0
    });

    return formatter.format(price)
}

render()

