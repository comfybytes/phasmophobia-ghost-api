const configData = require("../local/config.json");
const mysql = require('mysql');
function getConnection() {
    return mysql.createConnection({
        host: configData.host,
        port: configData.port,
        user: configData.user,
        password: configData.password,
        database: configData.database
    })
}
let db = getConnection((err) => {
    if (err){
        throw err;
    }
    console.log('creating Connection...')
});
db.connect((err) => {
    if (err){
        throw err;
    }
    console.log('Database Connected...')
})
module.exports = {
    dbase: db
};