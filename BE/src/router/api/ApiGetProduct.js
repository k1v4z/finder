const express = require('express')

const router = express.Router()

const initApiGetProduct = (app) =>{
    router.get('/tiki-product')
    app.use('/api/v1/',router)
}

module.exports = initApiGetProduct