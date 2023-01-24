var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'sql11.freesqldatabase.com',
    port: 3306,
    user: 'sql11592798',
    password: 'JAiLR1GJsU',
    database: 'sql11592798',
    insecureAuth: true
});

connection.connect(err => {
    if (err) throw new Error('mySql failed connection');
    console.log('connected to SQL server');
})


function runSQL(sqlCommand) {
    return new Promise((resolve, reject) => {
        connection.query(sqlCommand, function (error, results, fields) {
            if (error) reject(error);
            else resolve(results);
        });
    })
}

// connection.end();
module.exports = {
    runSQL
}