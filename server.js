// imports the mysql2 package so we can connect to the MySQL DB
const mysql = require('mysql2');
// imports express
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck = require('./utils/inputCheck');

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




//Get all candidates. I am wrapping the db.query code with an express.js route
app.get('/api/candidates', (req, res) => { //Route is designated with endpoint /api/candidates. the api in the URL signifies this is an API endpoint.
    const sql = `SELECT * FROM candidates`;  //SQL Prompt

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message }); // If error, send status code of 500.
            return;
        }
        res.json({  //if no error, response is sent back with the following statement.
            message: 'success', //Success message before all of the data
            data: rows //The data requested: the rows of candidates.
        });
    });
   
    // ! Below is the old db.query function.
    // // Query the db to test the connection
    // //Once this method executes the SQL command, the callback function captures the responses from the query in two variables: the err, which is the error response, and rows, which is the database query response.
    // //If there are no errors in the SQL query, the err value is null.
    // //This method is the key component that allows SQL commands to be written in a Node.js application.
    // db.query(`SELECT * FROM candidates`, (err, rows) => { // Presents a full list of all candidates
    //     console.log(rows);
    //   });   

});




// GET a single candidate
app.get('/api/candidate/:id', (req, res) => { //Here we're using the get() route method again. This time, the endpoint has a route parameter that will hold the value of the id to specify which candidate we'll select from the database.
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    const params = [req.params.id]; //Because params can be accepted in the database call as an array, params is assigned as an array with a single element, req.params.id. 

     //In the database call, we'll assign the captured value populated in the req.params object with the key id to params.
    db.query(sql, params, (err, row) => { // database call queries the candidates table with the generated id and retrieves the row specified.
      if (err) {
        res.status(400).json({ error: err.message }); //400 error code notifies user that their request was not accepted.
        return;
      }
      res.json({ //Send the row back to client as JSON object.
        message: 'success',
        data: row
      });
    });
    //! Old db.query function
    // db.query(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
    //       if (err) {
    //           console.log(err);
    //       }
    //       console.log(row);
    //   });
  });


  // Delete a candidate. This API endpoint could be connected to a button to remove a candidate from the list.
  app.delete('/api/candidate/:id', (req, res) => { // we must use the HTTP request method delete().
    const sql = `DELETE FROM candidates WHERE id = ?`; //Another prepared statement with a placeholder
    const params = [req.params.id]; //Just like the GET a single candidate 
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.statusMessage(400).json({ error: res.message }); //Err shows when you try to delete a non-existent candidate.
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } else {
        res.json({ //The JSON object route response will be the message "deleted", with the changes property set to result.affectedRows. This will verify whether any rows were changed.
          message: 'successfully deleted',
          changes: result.affectedRows, //Shows how many rows are affected
          id: req.params.id  //Shows the ID of the affected row.
        });
      }
    });
    //! Old db.query function
  // db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
  //     if (err) {
  //         console.log(err);
  //     }
  //     console.log(result);
  // });
  });


// Create a candidate
app.post('/api/candidate', ({ body }, res) => { //Use the POST method to insert a candidate into the table. In the callback function, use the object req.body to populate the candidate's data.
    //Notice that we're using object destructuring to pull the body property out of the request object. Until now, we've been passing the entire request object to the routes in the req parameter.
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected'); //In the callback function block, we assign errors to receive the return from the inputCheck function.
    if (errors) {
      res.status(400).json({ error: errors }); //function returns an error, an error message is returned to the client as a 400 status code, to prompt for a different user request with a JSON object that contains the reasons for the errors.
      // In order to use this function, we must import the module first. It is placed bear the top of server.js
      return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
        VALUES (?,?,?)`; //We don't worry about the ID, MySQL autogenerates the ID.
    const params = [body.first_name, body.last_name, body.industry_connected]; //These 3 elements in the params array contain the user data collected in req.body

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
  });

  //! Old function for creating a candidate.
// // Create a candidate. Activates SQL and inputs the command.
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
//               VALUES (?,?,?,?)`; // the SQL command. We have 4 '?' placeholders
// const params = [1, 'Ronald', 'Firbank', 1]; // The SQL parameters

// db.query(sql, params, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

// Default response for any other request (Not Found). Must be placed under all other routes.
app.use((req, res) => {
    res.status(404).end();
})

// starts the server on the PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});