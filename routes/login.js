const userModel = require("../models/userModel");
var express = require('express');
var router = express.Router();
var crypto = require("crypto");


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("login", { title: "Week 8: Quiz App"})
});

router.post("/", function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  const hash = crypto.createHash("md5").update(password).digest("hex");
  var sql = "select * from logininfo where username = ? and userpassword = ?";
  userModel.query(sql, [username, hash], function(error, result){
    if (error) throw error;
    if (result.length > 0) {
      res.redirect("mainmenu");
    } else {
      res.render("login", {error : true});
    }
  });
});

module.exports = router;
