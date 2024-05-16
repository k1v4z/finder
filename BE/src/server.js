require('dotenv').config({ path: '../.env' });

const express = require('express');
const app = express()
const port = process.env.PORT;
const localhost = process.env.HOST;

//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res) => {
    res.send('404 NOT Found');
})



app.listen(port, localhost, () => {
    console.log(`http://${localhost}:${port}`);
})

