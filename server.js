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
//set pug as our view engine 
app.set('view engine', 'pug');
app.set('views','./website/website_pug')

//database connection 
var database = require('./database');
var session = require('express-session')

app.use(session({
    secret:'webslesson',
    resave:true,
    saveUninitialized :true

}))

// runs server on port 3000 listening to any calls
app.listen(port, () => {
    console.log(`server is listening at http://localhost:3000`)
});
// route for mainpage
app.get('/', function (req, res) {
    res.render('home');
    console.log('homepage');
});

app.get('/login', function (req, res) {
    res.render("login",{session:req.session})

})

app.post('/login', function(request, response, next){

    var user_name = request.body.username;

    var user_password = request.body.password;

    if(user_name && user_password)
    {
        query = `
        SELECT * FROM user_login 
        WHERE user_email = "${user_name}"
        `;

        database.query(query, function(error, data){

            if(data.length > 0)
            {
                for(var count = 0; count < data.length; count++)
                {
                    if(data[count].user_password == user_password)
                    {
                        request.session.user_id = data[count].user_id;

                        response.redirect("/");
                    }
                    else
                    {
                        response.send('Incorrect Password');
                    }
                }
            }
            else
            {
                response.send('Incorrect Email Address');
            }
            response.end();
        });
    }
    else
    {
        response.send('Please Enter Email Address and Password Details');
        response.end();
    }

});

app.get('/logout', function(request, response, next){

    request.session.destroy();

    response.redirect("/");

});

module.exports = app;



