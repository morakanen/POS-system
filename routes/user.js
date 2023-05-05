const connection = require("../models/userModel");

var express = require("express")
var router = express.Router();

router.get("/", function(req, res, next) {
    var sqlquery = "SELECT  * from logininfo";
    connection.query(sqlquery, function(error, userinfo) {
        if (error) throw error;
        if (userinfo.length > 0) {
            res.render("user" , { userinfo} );
        }
    });
});

module.exports = router;