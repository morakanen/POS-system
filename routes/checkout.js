const connection = require("../models/userModel");

var express = require("express")
var router = express.Router();


router.get("/", function (req, res, next) {
    var sqlquery = "SELECT * from shoppingbasket";
    connection.query(sqlquery, function (error, basketinfo) {
        if (error) throw error;
        res.render("checkout", { basketinfo });
    });
});

router.post("/", function (req, res, next) {
    console.log("hello");
    var sql = "DELETE FROM shoppingbasket";
    connection.query(sql, function(error, result){
        if (error) throw error;
        res.render("checkout");
    });
});

module.exports = router;