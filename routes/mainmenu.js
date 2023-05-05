const connection = require("../models/userModel");

var express = require("express")
var router = express.Router();

router.get("/", function (req, res, next) {
    var sqlquery = "SELECT * from shoppingbasket";
    connection.query(sqlquery, function (error, basketinfo) {
        if (error) throw error;
        res.render("mainmenu", { basketinfo });
    });
});

router.post("/", function (req, res, next) {
    var sql = "INSERT INTO shoppingbasket SELECT * FROM menuitems WHERE name = ?";
    console.log(req.body.input);
    connection.query(sql, ""+req.body.input, function(error, result){
        if (error) throw error;

        var sqlquery = "SELECT * from shoppingbasket";
        connection.query(sqlquery, function (error, basketinfo) {
            if (error) throw error;
            res.render("mainmenu", { basketinfo });
        });
        
    });

});


module.exports = router;