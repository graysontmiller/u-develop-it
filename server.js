// imports the mysql2 package so we can connect to the MySQL DB
const mysql = require('mysql2');
// imports express
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

//express.js middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//Connect to the database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username
        user: 'root',
        // Your MySQL password
        password: 'Zgray123456a!',
        database: 'election'
    },
    console.log('Connected to the election database.')
)



// Query the db to test the connection
//Once this method executes the SQL command, the callback function captures the responses from the query in two variables: the err, which is the error response, and rows, which is the database query response.
//If there are no errors in the SQL query, the err value is null.
//This method is the key component that allows SQL commands to be written in a Node.js application.
db.query(`SELECT * FROM candidates`, (err, rows) => { // Presents a full list of all candidates
    // console.log(rows);
  });

  // GET a single candidate
db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
    //   if (err) {
    //       console.log(err);
    //   }
    //   console.log(row);
  });

  // Delete a candidate
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });


// Create a candidate. Activates SQL and inputs the command.
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
              VALUES (?,?,?,?)`; // the SQL command. We have 4 '?' placeholders
const params = [1, 'Ronald', 'Firbank', 1]; // The SQL parameters

db.query(sql, params, (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log(result);
});

// Default response for any other request (Not Found). Must be placed under all other routes.
app.use((req, res) => {
    res.status(404).end();
})

// starts the server on the PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});