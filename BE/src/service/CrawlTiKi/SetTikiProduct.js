const Product = require("../../model/Product");

//Upload tiki product into 
const setProduct = async (data) => {
    await Product.add(data)
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}

module.exports = setProduct