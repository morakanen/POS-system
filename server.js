const express = require('express');
//imports express framework
const app = express();
// defined port according to current express standards
const port = 3000;
// imports all the static files such as scripts and pictures from public folder
app.use(express.static('public'));
// imports body jsonParser
const bodyParser = require('body-parser');
//imports fs module so that we can save json data ot local system
const fs = require('fs');
///// use JSON parser
const jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({extended:false}));




// runs serfver on port 3000 listening to any calls
app.listen(port, () => {
    console.log(`server is listening at http://localhost:5000`)
});
// route for mainpage
app.get('/', function (req, res) {
    res.sendFile('/home.html');
    console.log('homepage');
});
//gets the success page upon successfully submitting file
app.get('/success', function (req, res) {
    res.redirect('/stayUpdatedSuccess.html');
})


