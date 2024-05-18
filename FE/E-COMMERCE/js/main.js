const searchInput = document.querySelector("#search-input");

searchInput.addEventListener("keydown", async function (event) {
    if (event.code === "Enter") {
        getProduct()
    }
});

async function getProduct() {
    // const product = await fetch(`http://localhost:4030/api/v1/tiki-product?name=${searchInput.value}`)
    // .then(res => res.json())
    // .catch(err => console.log(err))
    window.location.href = `Product.html?name=${searchInput.value}`

}