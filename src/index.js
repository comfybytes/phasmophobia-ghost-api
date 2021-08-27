const dbConnection = require("./dbConnection")
const express = require('express');
const mysql = require("mysql");
const configData = require("../local/config.json");
const app = express();
const port = 8080;


const db = dbConnection.getConnection();

console.log(db);
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('Database Connected...')
});

/* app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
}) */