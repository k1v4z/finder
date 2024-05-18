const tikiProduct = require("../service/CrawlTiKi/GetTikiProduct");
const sendoProduct = require("../service/CrawlSendo/GetSendoProduct");
const { writeData, readData } = require("../service/JsonFileService");

const getTikiProduct = async (req, res) => {
    const name = req.query.name
    const product = await tikiProduct(name)
    const nameOfProduct = readData()

    if(product.length == 0){
        //write name of product don't exist in database
        if (nameOfProduct == '') {
            const temp = []
            temp.push(name)
            writeData(temp)
        } else {
            const temp = JSON.parse(nameOfProduct).name
            temp.push(name) //push new value into exist array
            writeData(temp) //over write with new value
        }
    }

    try {
        return res.status(200).json(product)
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

const getSendoProduct = async (req, res) => {
    const name = req.query.name
    //console.log(name)
    const product = await sendoProduct(name)
    const nameOfProduct = readData()

    if(product.length == 0){
        //write name of product don't exist in database
        if (nameOfProduct == '') {
            const temp = []
            temp.push(name)
            writeData(temp)
        } else {
            const temp = JSON.parse(nameOfProduct).name
            temp.push(name) //push new value into exist array
            writeData(temp) //over write with new value
        }
    }

    try {
        return res.status(200).json(product)
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

module.exports = {
    getTikiProduct,
    getSendoProduct
}