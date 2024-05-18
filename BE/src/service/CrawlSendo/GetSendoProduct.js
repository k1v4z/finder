const Product = require("../../model/Product")
/**
 * 
 * @param {string} name: this is the name of the product
 * @returns the product that has the same category with the name
 */
const sendoProduct = async (name) => {
    const products = []
    console.log(name)
    await Product
        .where('category','==',`${name}`)
        .where('type','==','Sendo')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data())
                products.push(doc.data())
            })
        })
        .catch((error) => {
            console.log("Error getting documents: ", error)
        })
    return products
}

module.exports = sendoProduct