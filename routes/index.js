var express = require('express');
var router = express.Router();

var crypto = require("crypto");

const connection = require("../models/userModel");

admin = false;
loggedIn = false;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'POS System' });
});

router.get("/getByCategory/:category?", function(req, res, next) {
  if (!loggedIn) {
    res.redirect("login");
    return;
  } 
  console.log(req.query.category);
  connection.query("SELECT * from shoppingbasket", function (error, shoppingBasketInfo) {
    if (error) throw error;
      connection.query("SELECT * from product where category = ?", req.query.category, function (error, categories) {
        if (error) throw error;
        productTime = true;
        res.render("mainmenu", { shoppingBasketInfo, categories, productTime})
    });
  });
});

router.get('/mainmenu', function(req, res, next) {
  if (!loggedIn) {
    res.redirect("login");
    return;
  } 
  connection.query("SELECT * from shoppingbasket", function (error, shoppingBasketInfo) {
    if (error) throw error;
    connection.query("SELECT * from categories", function (error, categories) {
      if (error) throw error;
      productTime = false;
      res.render("mainmenu", { shoppingBasketInfo, categories, productTime });
    });
  });
});

router.post("/checkout", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  } 

  connection.query("SELECT SUM(price) AS totalPrice FROM shoppingbasket", function (error, totalPrice) {
    if (error) throw error;
    totalPrice = totalPrice[0].totalPrice;
    console.log(totalPrice)
    res.render("checkout", {totalPrice });
    });
});

router.get("/getShoppingBasket", function (req, res, next) {
  if (!loggedIn) {
    res.redirect("login");
    return;
  } 
  var sqlquery = "SELECT * from shoppingbasket";
  connection.query(sqlquery, function (error, basketinfo) {
      if (error) throw error;
      res.render("mainmenu", { basketinfo });
  });
});

router.post("/Undo", function (req, res, next) {
  if (!loggedIn) {
    res.redirect("login");
    return;
  } 
  connection.query("delete from shoppingbasket order by shoppingItemId desc limit 1;", function(error, result){
    if (error) throw error;
    connection.query("SELECT * from shoppingbasket", function (error, shoppingBasketInfo) {
      if (error) throw error;
      connection.query("SELECT * from categories", function (error, categories) {
        if (error) throw error;
        productTime = false;
        res.render("mainmenu", { shoppingBasketInfo, categories, productTime});
      });
    });
  });
});

router.get("/crazyTransaction", function (req, res, next) {
  if (!loggedIn) {
    res.redirect("login");
    return;
  } 
  connection.query(`INSERT INTO product(name, category, ageRestricted, price) values ('${req.query.name}', 'Extras', ${false}, ${req.query.price})`, function(error, result){
    if (error) throw error;
    connection.query("INSERT INTO shoppingbasket(productId, name, category, ageRestricted, price, twoForOne, percentOFf) SELECT * FROM product WHERE name = ?", req.query.name, function (error, shoppingBasketInfo) {
      if (error) throw error;
      connection.query("DELETE FROM product WHERE name = ?", req.query.name, function(error, results) {
        if (error) throw error;
          connection.query("SELECT * from shoppingbasket", function (error, shoppingBasketInfo) {
          if (error) throw error;
          connection.query("SELECT * from categories", function (error, categories) {
            if (error) throw error;
            productTime = false;
            res.render("mainmenu", { shoppingBasketInfo, categories, productTime});
          });
        });
      });
    });
  });
});

router.post("/backtomainmenu", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  } 
  connection.query("INSERT INTO pastTransactions(shoppingItemId, productId, name, category, ageRestricted, price, twoForOne, percentOFf) SELECT * FROM shoppingbasket;", function(error, result){
    if (error) throw error;

    connection.query("insert into transactions values();", function(error, result){
      if (error) throw error;
      connection.query("update pastTransactions SET transactionId = (SELECT transactionId FROM transactions ORDER BY transactionId DESC LIMIT 1) where transactionId = 0;", function(error, result){
        if (error) throw error;

        connection.query("DELETE FROM shoppingbasket", function(error, result){
          if (error) throw error;

          connection.query("SELECT * from shoppingbasket", function (error, shoppingBasketInfo) {
            if (error) throw error;

            connection.query("SELECT * from categories", function (error, categories) {
              if (error) throw error;
              productTime = false;
              res.render("mainmenu", { shoppingBasketInfo, categories, productTime});
            });
          });
        });
      });
    });
  });
});


router.get("/cashPayment:cash?", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  } 
  console.log(req.query.cash)
  connection.query("SELECT SUM(price) AS totalPrice FROM shoppingbasket", function(error, result){
    if (error) throw error;
    if (result != null) {
      if (req.query.cash < result[0].totalPrice) {
        checkoutErr = "Not Enough Cash";
        totalPrice = result[0].totalPrice;
        res.render("checkout", {totalPrice, checkoutErr});
        return;
      } else {
        checkoutErr = `Change Due: ${(req.query.cash - result[0].totalPrice).toFixed(2)}`;
        flag = true;
        res.render("checkout", {checkoutErr, flag});
        flag = false;
        checkoutErr = null;
        return;
      }
    }

  });
});

/* GET users listing. */
router.get('/login', function(req, res, next) {
  admin = false;
  loggedIn = false;
  res.render("login", { title: "Login"})
});

router.post("/login", function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
   
  admin = false;
  loggedIn = false;

  const hash = crypto.createHash("md5").update(password).digest("hex");
  var sql = "select * from logininfo where username = ? and userpassword = ?";
  connection.query(sql, [username, hash], function(error, result){
    if (error) throw error;
    if (result.length > 0) {
      if (result[0].adminbool) admin = true;
      loggedIn = true;
      res.redirect("mainmenu");
    } else {
      res.render("login", {error : true});
    }
  });
});


router.post("/cardPayment", function (req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  } 
  connection.query("INSERT INTO pastTransactions(shoppingItemId, productId, name, category, ageRestricted, price, twoForOne, percentOFf) SELECT * FROM shoppingbasket;", function(error, result){
    if (error) throw error;

    connection.query("insert into transactions values();", function(error, result){
      if (error) throw error;
      connection.query("update pastTransactions SET transactionId = (SELECT transactionId FROM transactions ORDER BY transactionId DESC LIMIT 1) where transactionId = 0;", function(error, result){
        if (error) throw error;

        connection.query("DELETE FROM shoppingbasket", function(error, result){
          if (error) throw error;

          connection.query("SELECT * from shoppingbasket", function (error, shoppingBasketInfo) {
            if (error) throw error;

            connection.query("SELECT * from categories", function (error, categories) {
              if (error) throw error;
              productTime = false;
              res.render("mainmenu", { shoppingBasketInfo, categories, productTime});
            });
          });
        });
      });
    });
  });
});

router.post("/clearBasket", function (req, res, next) {
  if (!loggedIn) {
    res.redirect("login");
    return;
  } 
    connection.query("DELETE FROM shoppingbasket", function(error, result){
    if (error) throw error;

    connection.query("SELECT * from shoppingbasket", function (error, shoppingBasketInfo) {
      if (error) throw error;

      connection.query("SELECT * from categories", function (error, categories) {
        if (error) throw error;
        productTime = false;
        res.render("mainmenu", { shoppingBasketInfo, categories, productTime});
      });
    });
  });
});

router.get("/addToShopping2/:product?", async function (req, res, next) {
  if (!loggedIn) {
    res.redirect("login");
    return;
  } 
  connection.query("SELECT * from product WHERE name = ?", req.query.name, async function(error, result){
    if (error) throw error;
      var sql = "INSERT INTO shoppingbasket(productId, name, category, ageRestricted, price, twoForOne, percentOFf) SELECT * FROM product WHERE name = ?";
      connection.query(sql, req.query.name, function(error, dontcare){
      if (error) throw error;

      if (result[0].twoForOne){
        connection.query("SELECT COUNT(productId) AS numOfProduct FROM shoppingbasket WHERE name = ?", req.query.name, function(error, result){
          if (error) throw error;
          if (result[0].numOfProduct % 2 == 0) {
            connection.query("UPDATE shoppingbasket SET price = 0 ORDER BY shoppingItemID DESC LIMIT 1;", function(error, result){
              if (error) throw error;

            });
          }
        });
      } if (result[0].percentOff > 0) {
          console.log(result[0].percentOff)
          console.log(result[0].price)
          priceChange = result[0].price * ((100 - result[0].percentOff) / 100)
          connection.query("UPDATE shoppingbasket SET price = ? ORDER BY shoppingItemID DESC LIMIT 1;", priceChange, function(error, result){
              if (error) throw error;

          });
      }
    });
    await new Promise(resolve => setTimeout(resolve, 50));
    var sqlquery = "SELECT * from shoppingbasket";
    connection.query(sqlquery, function (error, shoppingBasketInfo) {
      if (error) throw error;
      connection.query("SELECT * from categories", function (error, categories) {
        if (error) throw error;
        productTime = false;
        res.render("mainmenu", { shoppingBasketInfo, categories, productTime});
      });
    });
  });
});

router.get("/endofday", function (req, res, next) {
  if (!loggedIn) {
    res.redirect("login");
    return;
  }
  connection.query("SELECT name, price, COUNT(*) as count FROM pastTransactions GROUP BY name, price order by count;", function(error, results){
    if (error) throw error;
    console.log(results);
    res.render("endofday", {results});
  });
});


router.get("/endofdayCount", function (req, res, next) {
  if (!loggedIn) {
    res.redirect("login");
    return;
  }
  connection.query("SELECT name, price, COUNT(*) as count FROM pastTransactions GROUP BY name, price order by count DESC;", function(error, results){
    if (error) throw error;
    console.log(results);
    res.render("endofday", {results});
  });
});

router.get("/endofdayName", function (req, res, next) {
  if (!loggedIn) {
    res.redirect("login");
    return;
  }
  connection.query("SELECT name, price, COUNT(*) as count FROM pastTransactions GROUP BY name, price order by name ;", function(error, results){
    if (error) throw error;
    console.log(results);
    res.render("endofday", {results});
  });
});

router.get("/endofdayPrice", function (req, res, next) {
  if (!loggedIn) {
    res.redirect("login");
    return;
  }
  connection.query("SELECT name, price, COUNT(*) as count FROM pastTransactions GROUP BY name, price order by price DESC;", function(error, results){
    if (error) throw error;
    console.log(results);
    res.render("endofday", {results});
  });
});


router.get("/addToShopping/:product?", async function (req, res, next) {
  if (!loggedIn) {
    res.redirect("login");
    return;
  } 
  connection.query("SELECT * from product WHERE name = ?", req.query.product, async function(error, result){
    if (error) throw error;
    if (result[0].ageRestricted) {
      product = req.query.product;
      res.render("agerestricted", {product});
      return;
    }

      var sql = "INSERT INTO shoppingbasket(productId, name, category, ageRestricted, price, twoForOne, percentOFf) SELECT * FROM product WHERE name = ?";
      connection.query(sql, req.query.product, function(error, dontcare){
      if (error) throw error;

      if (result[0].twoForOne){
        connection.query("SELECT COUNT(productId) AS numOfProduct FROM shoppingbasket WHERE name = ?", req.query.product, function(error, result){
          if (error) throw error;
          if (result[0].numOfProduct % 2 == 0) {
            connection.query("UPDATE shoppingbasket SET price = 0 ORDER BY shoppingItemID DESC LIMIT 1;", function(error, result){
              if (error) throw error;

            });
          }
        });
      } if (result[0].percentOff > 0) {
          console.log(result[0].percentOff)
          console.log(result[0].price)
          priceChange = result[0].price * ((100 - result[0].percentOff) / 100)
          connection.query("UPDATE shoppingbasket SET price = ? ORDER BY shoppingItemID DESC LIMIT 1;", priceChange, function(error, result){
              if (error) throw error;

          });
      }
    });
    await new Promise(resolve => setTimeout(resolve, 50));
    var sqlquery = "SELECT * from shoppingbasket";
    connection.query(sqlquery, function (error, shoppingBasketInfo) {
      if (error) throw error;
      connection.query("SELECT * from categories", function (error, categories) {
        if (error) throw error;
        productTime = false;
        res.render("mainmenu", { shoppingBasketInfo, categories, productTime});
      });
    });
  });
});


//-------------------------------------ADMIN STUFF---------------------------------------


router.get("/adminpanel", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }

  res.render("adminpanel");
});

// -------------- Discounts functions ------------------//
router.get("/discounts", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }

  connection.query("SELECT * from product", function (error, productInfo) {
    if (error) throw error;
    res.render("discounts", {productInfo});
  });
})

router.get("/changeTwoForOne", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }

  connection.query("SELECT * from product where name = ?", req.query.name, function (error, result) {
    mybool = 0;
    if (error) throw error;
    if (result[0].twoForOne == 1) {
      mybool = 0;
    } else {
      mybool = 1;
    }

    connection.query("UPDATE product SET twoForOne = ? WHERE name = ?", [mybool, req.query.name], function(error, results){
      if (error) throw error;
      connection.query("SELECT * from product", function (error, productInfo) {
        if (error) throw error;
        res.render("discounts", {productInfo});
      });
    });
  });
});


router.get("/changePercentOff", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }

  connection.query("UPDATE product SET percentOff = ? WHERE name = ?", [req.query.percentOff, req.query.name], function(error, results){
    if (error) throw error;
    connection.query("SELECT * from product", function (error, productInfo) {
      if (error) throw error;
      res.render("discounts", {productInfo});
    });
  });
});


//-------------------Modify Products Functions------------------------------//

router.get("/modifyproducts", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }
  connection.query("SELECT * from product", function (error, productInfo) {
    if (error) throw error;
    res.render("modifyproducts", {productInfo});
  });

})

router.get("/addproduct", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }

  res.render("addproduct");

})

router.post("/addproduct", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }

  console.log(req.body);

  connection.query("INSERT INTO product(name, category, ageRestricted, price, twoForOne, percentOff) VALUES(?, ?, ?, ?, ?, ?)", [req.body.name, req.body.categories, Boolean(req.body.ageRestricted), req.body.price, Boolean(req.body.twoForOne), req.body.percentoff], function(error, result){
    if (error) throw error;
    connection.query("SELECT * from product", function (error, productInfo) {
      if (error) throw error;
      res.render("modifyproducts", {productInfo});
    });
  });
})


router.get("/changeName", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }

  connection.query("UPDATE product SET name = ? WHERE name = ?", [req.query.percentOff, req.query.name], function(error, results){
    if (error) throw error;

    connection.query("SELECT * from product", function (error, productInfo) {
      if (error) throw error;
      res.render("modifyproducts", {productInfo});
    });
  });
});

router.get("/changePrice", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }

  connection.query("UPDATE product SET price = ? WHERE name = ?", [req.query.percentOff, req.query.name], function(error, results){
    if (error) throw error;

    connection.query("SELECT * from product", function (error, productInfo) {
      if (error) throw error;
      res.render("modifyproducts", {productInfo});
    });
  });
});

router.get("/changeCategory", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }

  connection.query("UPDATE product SET category = ? WHERE name = ?", [req.query.percentOff, req.query.name], function(error, results){
    if (error) throw error;

    connection.query("SELECT * from product", function (error, productInfo) {
      if (error) throw error;
      res.render("modifyproducts", {productInfo});
    });
  });
});


router.get("/changeAgeRestricted", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }

  connection.query("SELECT * from product where name = ?", req.query.name, function (error, result) {
    mybool = 0;
    if (error) throw error;
    if (result[0].ageRestricted == 1) {
      mybool = 0;
    } else {
      mybool = 1;
    }

    connection.query("UPDATE product SET ageRestricted = ? WHERE name = ?", [mybool, req.query.name], function(error, results){
      if (error) throw error;
      connection.query("SELECT * from product", function (error, productInfo) {
        if (error) throw error;
        res.render("modifyproducts", {productInfo});
      });
    });
  });
});


//-----------------------User Update Functions---------------------------//

router.get("/userupdate", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }


  connection.query("SELECT * from logininfo", function (error, userInfo) {
    if (error) throw error;
    res.render("userupdate", {userInfo});
  });
})

router.get("/changeUserName", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }

  connection.query("UPDATE logininfo SET username = ? WHERE username = ?", [req.query.percentOff, req.query.name], function(error, results){
    if (error) throw error;

    connection.query("SELECT * from logininfo", function (error, userInfo) {
      if (error) throw error;
      res.render("userupdate", {userInfo});
    });
  });
});


router.get("/changeUserPassword", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }
  hash = crypto.createHash('md5').update(req.query.percentOff).digest('hex');
  connection.query("UPDATE logininfo SET userpassword = ? WHERE username = ?", [hash, req.query.name], function(error, results){
    if (error) throw error;

    connection.query("SELECT * from logininfo", function (error, userInfo) {
      if (error) throw error;
      res.render("userupdate", {userInfo});
    });
  });
});

router.get("/removeuser", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }
  connection.query("DELETE FROM logininfo WHERE username = ?", req.query.name, function (error, result) {
    if (error) throw error;  

    connection.query("SELECT * from logininfo", function (error, userInfo) {
      if (error) throw error;
      res.render("userupdate", {userInfo});
    });
  });
});

router.get("/changeUserAdmin", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }

  connection.query("SELECT * from logininfo where username = ?", req.query.name, function (error, result) {
    mybool = 0;
    if (error) throw error;
    if (result[0].adminbool == 1) {
      mybool = 0;
    } else {
      mybool = 1;
    }

    connection.query("UPDATE logininfo SET adminbool = ? WHERE username = ?", [mybool, req.query.name], function(error, results){
      if (error) throw error;
      connection.query("SELECT * from logininfo", function (error, userInfo) {
        if (error) throw error;
        res.render("userupdate", {userInfo});
      });
    });
  });
});


router.get("/adduser", function(req, res, next){
  res.render("adduser");
});

router.post("/addUser", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }
  
  console.log(req.body)

  hash = crypto.createHash('md5').update(req.body.password).digest('hex');
  connection.query("INSERT INTO logininfo(username, userpassword, adminbool) values (?, ?, ?)", [req.body.username, hash, req.body.admin], function(error, result){

  connection.query("SELECT * from logininfo", function (error, userInfo) {
    if (error) throw error;
    res.render("userupdate", {userInfo});
    });
  });
})



//--------------------------Filter Product Functions----------------------------------------//

router.get("/filterproducts", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }

  res.render("userupdate");

})


//-------------------------Refunds------------------------------------------//
router.get("/refunds", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }

  firstload = true;
  res.render("refunds", {firstload});

})

router.get("/refundRequest", function(req, res, next){ 
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }

  connection.query("INSERT INTO pastTransactions(shoppingItemId, productId, name, category, ageRestricted, price, twoForOne, percentOFf) values(999, 999, 'refund', 'Extras', 0, ?, 0, 0)", -Math.abs(req.query.percentOff), function(error, result){
    if (error) throw error;
    connection.query("insert into transactions values();", function(error, result){
      if (error) throw error;
      connection.query("update pastTransactions SET transactionId = (SELECT transactionId FROM transactions ORDER BY transactionId DESC LIMIT 1) where transactionId = 0;", function(error, result){
        if (error) throw error;
      });
    });
  });
  res.render("adminpanel");
});

router.get("/receiptNumberCheck", function(req, res, next){
  if (!loggedIn) {
    res.redirect("login");
    return;
  }if (!admin) {
    res.render("noaccess");
    return;
  }
  connection.query("SELECT * FROM pastTransactions where transactionId = ?", req.query.percentOff, function(error, results){
    if (error) throw error;
    if (results.length <= 0) {
      errorFlag = true;
      firstload = false;
      res.render("refunds", {errorFlag, firstload});
      return;
    }
    errorFlag = false;
    firstload = false;
    res.render("refunds", {results, errorFlag, firstload});
  });

})


module.exports = router;
