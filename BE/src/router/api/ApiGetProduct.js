const express = require('express')
const { getTikiProduct } = require('../../controller/GetProductController')
const { getSendoProduct } = require('../../controller/GetProductController')

const router = express.Router()

const initApiGetProduct = (app) => {
    router.get('/tiki-product', getTikiProduct)
    app.use('/api/v1/', router)
}

const getSendoProductApi = (app) => {
    router.get('/sendo-product', getSendoProduct)
    app.use('/api/v1/', router)
}

module.exports = {
    initApiGetProduct,
    getSendoProductApi
}