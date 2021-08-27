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
module.exports = {
    getConnection,
};