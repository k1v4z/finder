const Product = require("../../model/Product")

const tikiProduct = async (name) => {
    const product = []
    await Product
        .where('type','==',`Tiki`)
        .where('products_name','==',`${name}`) //where clause for the 'AND' condition
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                product.push(doc.data())
            })
        })
        .catch((error) => {
            console.log("Error getting documents: ", error)
        })

    return product
}

module.exports = tikiProduct