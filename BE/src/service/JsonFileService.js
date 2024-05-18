//This service regarding write,read and delete data in json file
const fs = require('fs')

const readData = () => {
    fs.readFile('../ProductCrawl.json', function (err) {
        if (err) return console.log(err)

        console.log("The file was saved!")
    })
}

const writeData = (nameOfProduct) => {
    fs.writeFile('../ProductCrawl.json',{nameOfProduct: nameOfProduct},function(err){
        if (err) return console.log(err)

        console.log("The file was saved!")
    })
}