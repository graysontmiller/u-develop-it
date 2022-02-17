// imports express
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

//express.js middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());




// Default response for any other request (Not Found). Must be placed under all other routes.
app.use((req, res) => {
    res.status(404).end();
})

// starts the server on the PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});