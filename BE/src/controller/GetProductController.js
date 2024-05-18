const tikiProduct = require("../service/CrawlTiKi/GetTikiProduct");

const getTikiProduct = async (req, res) => {
    const name = req.query.name

    const product = await tikiProduct(name)
    
    if(product == []){ //if don't have data in database, save to file and crawl later
        
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
    getTikiProduct
}