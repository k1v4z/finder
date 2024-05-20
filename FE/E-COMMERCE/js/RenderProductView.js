const urlParams = new URLSearchParams(window.location.search);
const products_name = urlParams.get('name');
const image_tiki = document.querySelector('.card-img-top-tiki');
const products_name_tiki = document.querySelector('.products-name-tiki')
const score_rating_tiki = document.querySelector('.score-rating-tiki')
const sold_count_tiki = document.querySelector('.sold-count-tiki')
const link_tiki = document.querySelector('.product-link-tiki')

const image_sendo = document.querySelector('.card-img-top-sendo');
const products_name_sendo = document.querySelector('.products-name-sendo')
const score_rating_sendo = document.querySelector('.score-rating-sendo')
const sold_count_sendo = document.querySelector('.sold-count-sendo')
const link_sendo = document.querySelector('.product-link-sendo')

const types = ['Tiki', 'Sendo']

console.log(products_name);

async function getTikiProduct() {
    try {
        const response = await fetch(`http://localhost:4030/api/v1/tiki-product?name=${products_name}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const productData = await response.json(); // Parse the JSON data
        return productData;
    } catch (error) {
        console.error('Error fetching product:', error);
        return {}; // Return an empty object on error
    }
}

async function getSendoProduct() {
    try {
        const response = await fetch(`http://localhost:4030/api/v1/sendo-product?name=${products_name}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const productData = await response.json(); // Parse the JSON data
        return productData;
    } catch (error) {
        console.error('Error fetching product:', error);
        return {}; // Return an empty object on error
    }
}

async function render() {
    const productTiki = await getTikiProduct();
    const productSendo = await getSendoProduct();

    //after sort product[2] is the best product
    image_tiki.src = productTiki[2].image
    products_name_tiki.innerHTML = productTiki[2].name
    score_rating_tiki.innerHTML = `Đánh giá: ${productTiki[2].score_rating}/5`
    sold_count_tiki.innerHTML = 'Đã  bán: ' + productTiki[2].soldCount
    link_tiki.href = productTiki[2].url

    image_sendo.src = productSendo[2].imageURL
    products_name_sendo.innerHTML = productSendo[2].name
    score_rating_sendo.innerHTML = `Đánh giá: ${productSendo[2].scoreRating}/5`
    sold_count_sendo.innerHTML = 'Đã  bán: ' + productSendo[2].soldCount
    link_sendo.href = productSendo[2].href

    console.log(productSendo)
    // Use product data here (e.g., image.src = product.imageUrl)
}

document.querySelectorAll('.btn-outline-warning').forEach((btn,index) => {
    btn.addEventListener('click', () => {
        //index 0 is tiki, index 1 is sendo
        window.location.href = `show-more.html?name=${products_name}&type=${types[index]}`
    })
})

render()

export {getTikiProduct, getSendoProduct}