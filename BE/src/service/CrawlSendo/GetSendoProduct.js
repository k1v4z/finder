const Product = require("../../model/Product")
/**
 * 
 * @param {string} name: this is the name of the product
 * @returns the product that has the same category with the name
 */
const sendoProduct = async (name) => {
    const products = []

    await Product
        .where('category','==',`${name}`)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data())
                product.push(doc.data())
            })
        })
        .catch((error) => {
            console.log("Error getting documents: ", error)
        })
    return products
}

module.exports = sendoProduct