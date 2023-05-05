router.post("/", function (req, res, next) {
    console.log("hello");
    var sql = "DELETE FROM shoppingbasket";
    connection.query(sql, function(error, result){
        if (error) throw error;
        res.render("mainmenu");
    });
});