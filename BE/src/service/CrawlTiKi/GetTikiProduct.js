const Product = require("../../model/Product")

const tikiProduct = async (name) => {
    const product = []

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

    return product
}

module.exports = tikiProduct