//This service regarding write,read and delete data in json file
const fs = require('fs')

const readData = () => {
    const data = fs.readFileSync('./src/ProductCrawl.json', 'utf8')
    return data
}

const writeData = (nameOfProduct) => {
    fs.writeFile('./src/ProductCrawl.json', JSON.stringify({ name: nameOfProduct }), function (err) {
        if (err) {
            console.log("Error:5 " + err);
        }
        else {
            console.log("Successfully write 2");
        }
    })
    console.log("Saved")
}

//delete all name of product
const clearData = () => {
    let data = readData();
    fs.writeFileSync('./src/ProductCrawl.json', JSON.stringify({ name: data }))
    console.log('Clear successful')
}

module.exports = {
    writeData,
    readData,
    clearData
}