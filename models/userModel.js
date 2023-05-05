const mysql = require("mysql");

var connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "userdb"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected with database succesfully!");
});

module.exports = connection
