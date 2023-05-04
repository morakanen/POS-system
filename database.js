const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'test',
    user: 'root',
    password:'pass',
    port:'3000'
})

connection.connect(function(error){
    if(error){
        throw error;
    }
    else{
        console.log('connection with serevr is active')
    }

});