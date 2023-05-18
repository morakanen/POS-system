var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var login = require('./routes/login');
var user = require('./routes/user');
var mainmenu = require('./routes/mainmenu');
var checkout = require('./routes/checkout');
var products = require('./routes/productview');
var connection = require('./models/userModel');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jsonParser = bodyParser.json();

app.use('/', indexRouter);
app.use('/login', login);
app.use('/user', user);
app.use('/mainmenu', mainmenu);
app.use('/checkout', checkout);
app.use('/productview', products);

// Handle form submission
app.post('/submit-form', (req, res) => {
  const { name, stock, price, ageRestricted,twoForOne,percentOff } = req.body;
  
  // Validate form data
  if (!name || !stock || !price) {
    return res.status(400).json({ error: 'Please fill out all fields.' });
  }

  // Convert agerestricted checkbox value to boolean
  const isAgeRestricted = ageRestricted === 'on';

  //convert twoforone into boolean
  const istwoforone = twoForOne === 'on';

  // Insert data into the database
  connection.query('INSERT INTO product (name, stock, price, agerestricted,twoForOne,percentOff) VALUES (?, ?, ?, ?,?,?)', [name, stock, price, isAgeRestricted,istwoforone,percentOff], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while submitting the form.' });
    }
    return res.status(200).json({ message: 'Form submitted successfully.' });
    res.render("/main-menu")
  });
});

// Handle form submission for updating data
app.post('/update-form', (req, res) => {
  console.log("Received data");
  const { productId, name, stock, price, ageRestricted ,twoForOne,percentOff } = req.body;
  
  // Validate form data
  if (!productId || !name || !stock || !price) {
    return res.status(400).json({ error: 'Please fill out all fields.' });
  }

  // Convert agerestricted checkbox value to boolean
  const isAgeRestricted = ageRestricted === 'on';

    //convert twoforone into boolean
  const istwoforone = twoForOne === 'on';

  const updatedStock = stock || 0;

  // Update the data in the database
  connection.query('UPDATE product SET name = ?, stock = ?, price = ?, agerestricted = ? ,twoForOne =?,percentOff=?  WHERE productId = ?', [name, updatedStock, price, isAgeRestricted,istwoforone,percentOff, productId,], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while updating the form.' });
    }
    return res.status(200).json({ message: 'Form updated successfully.' });
  });
});



// Handle item filtering
app.post('/filter-items', (req, res) => {
  console.log("Received data for filter");
  const { filter } = req.body;

  // Perform the filtering based on the selected filter
  let query;
  if (filter === 'name') {
    // Filter by item name
    query = 'SELECT * FROM product ORDER BY name';
  } else if (filter === 'price') {
    // Filter by item price
    query = 'SELECT * FROM product ORDER BY price';
  } else {
    // Invalid filter option
    return res.status(400).json({ error: 'Invalid filter option.' });
  }

  // Execute the query
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while filtering the items.' });
    }
    // Return the filtered items as a response
    return res.status(200).json({ items: results });
  });
});

module.exports = app;