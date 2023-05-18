const connection = require("../models/userModel");



  
  

var express = require("express")
var router = express.Router();

router.get('/', (req, res) => {
  // Fetch data from the MySQL database
  connection.query('SELECT * FROM product', (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Error querying database');
    }

    // Render the data using the Pug template
    res.render('productview', { data: results });
  });
});



module.exports = router;