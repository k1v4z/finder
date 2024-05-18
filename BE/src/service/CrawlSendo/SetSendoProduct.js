const Product = require("../../model/Product");

//Upload sendo product into
const setSendoProduct = async (data) => {
    await Product.add(data)
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}


module.exports = setSendoProduct