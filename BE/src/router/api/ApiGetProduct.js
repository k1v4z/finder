const express = require('express')
const { getTikiProduct } = require('../../controller/GetProductController')
const { getSendoProduct } = require('../../controller/GetProductController')
const blockEndPoint = require('../../middleware/block')

const router = express.Router()

const initApiGetProduct = (app) => {
    router.get('/tiki-product', blockEndPoint, getTikiProduct)
    app.use('/api/v1/', router)
}

const getSendoProductApi = (app) => {
    router.get('/sendo-product', blockEndPoint, getSendoProduct)
    app.use('/api/v1/', router)
}

module.exports = {
    initApiGetProduct,
    getSendoProductApi
}