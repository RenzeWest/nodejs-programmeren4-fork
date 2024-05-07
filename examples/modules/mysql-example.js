// Get the client
const mysql = require('mysql2');

// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'share-a-meal',
});

// A simple SELECT query
connection.query(
  'SELECT * FROM `meal` ',
  function (err, results, fields) {
    console.log('Results first query \n')
    console.log(results); // results contains rows returned by server
    console.log('Metadata')
    console.log(fields); // fields contains extra meta data about results, if available
  }
);

// Using placeholders TODO: aanpassen naar juiste database
connection.query(
  'SELECT * FROM `meal` WHERE `isActive` = ?', // Zo gebruik je perpared statements
  [1], // Als het er meer zijn dan [1, 2 ,3 , enz...]
  function (err, results) {
    console.log('Results second query \n')
    console.log(results);
  }
);

connection.end()