const express = require('express');
const app = express();

// GET requests

app.get("/", (req, res) => {
    res.send("Welcome to the movie app!")
});