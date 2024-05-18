const express = require('express')
const getHomepage = require('../../controller/HomepageController.js')
const router = express.Router()

router.get('/', getHomepage)

module.exports = router