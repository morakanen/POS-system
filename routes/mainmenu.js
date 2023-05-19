const connection = require("../models/userModel");

var express = require("express")
var router = express.Router();





router.get("/", function (req, res, next) {
    var sqlquery = "SELECT * from shoppingbasket";
    connection.query(sqlquery, function (error, basketinfo) {
        if (error) throw error;
        res.render("mainmenu", { basketinfo });// ahs a hello pa[rameter that wasnt working]
    });
});

router.post("/", function (req, res, next) {
    console.log(req.body.input);
    if (req.body.input === "Clear Basket"){
        var sql = "DELETE FROM shoppingbasket";
        connection.query(sql, function(error, result){
            if (error) throw error;
            res.render("mainmenu");
        });
    } else if (req.body.input === "Undo"){
        var sql = "delete from shoppingbasket order by shoppingItemId desc limit 1;";
        connection.query(sql, ""+req.body.input, function(error, result){
            if (error) throw error;

            var sqlquery = "SELECT * from shoppingbasket";
            connection.query(sqlquery, function (error, basketinfo) {
                if (error) throw error;
                res.render("mainmenu", { basketinfo });
            });
        });
    } 
    
    
    else {
        var sql = "INSERT INTO shoppingbasket (itemId, name, stock, ageRestricted, price) SELECT * FROM menuitems WHERE name = ?";
        console.log(req.body.input);
        connection.query(sql, ""+req.body.input, function(error, result){
            if (error) throw error;

            var sqlquery = "SELECT * from shoppingbasket";
            connection.query(sqlquery, function (error, basketinfo) {
                if (error) throw error;
                res.render("mainmenu", { basketinfo });
            });
        });
    }
});
module.exports = router;



