const urlParams = new URLSearchParams(window.location.search);
const products_name = urlParams.get('name');
const image = document.querySelector('.card-img-top');
console.log(products_name);

async function getProduct() {
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

async function render() {
    const product = await getProduct();
    console.log(product);
    image.src = product[1].image
    // Use product data here (e.g., image.src = product.imageUrl)
}

render()

