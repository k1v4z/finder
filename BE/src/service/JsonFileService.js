//This service regarding write,read and delete data in json file
const fs = require('fs')

const readData = () => {
    const data = fs.readFileSync('ProductCrawl.json','utf8')
    return data
}

const writeData = (nameOfProduct) => {
    fs.writeFileSync('ProductCrawl.json',JSON.stringify({name: nameOfProduct}))
    console.log("Saved")
}

module.exports = {
    writeData,
    readData
}