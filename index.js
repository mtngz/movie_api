const express = require('express'),
    morgan = require("morgan"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override");
const app = express();

// express.static for documentation.html
app.use(express.static("public"));

// LOG
app.use(morgan('common'));

// Error
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

let movies = [
    {title: "Iron Man", director: "Jon Favreau"},
    {title: "The Incredible Hulk", director: "Louis Leterrier"},
    {title: "Iron Man 2", director: "Jon Favreau"},
    {title: "Thor", director: "Kenneth Branagh"},
    {title: "Captain America: The First Avenger", director: "Joe Johnston"},
    {title: "Marvel's The Avengers", director: "Joss Whedon"},
    {title: "Iron Man 3", director: "Shane Black"},
    {title: "Thor: The Dark World", director: "Alan Taylor"},
    {title: "Captain America: The Winter Soldier", director: "Anthony and Joe Russo"},
    {title: "Guardians of the Galaxy", director: "James Gunn"},
    {title: "Avengers: Age of Ultron", director: "Joss Whedon"},
    {title: "Ant-Man", director: "Peyton Reed"},
    {title: "Captain America: Civil War", director: "Anthony and Joe Russo"},
    {title: "Doctor Strange", director: "Scott Derrickson"},
    {title: "Guardians of the Galaxy Vol. 2", director: "James Gunn"},
    {title: "Spider-Man: Homecoming", director: "Jon Watts"},
    {title: "Thor: Ragnarok", director: "Taika Waititi"},
    {title: "Black Panther", director: "Ryan Coogler"},
    {title: "Avengers: Infinity War", director: "Anthony and Joe Russo"},
    {title: "Ant-Man and the Wasp", director: "Peyton Reed"},
    {title: "Captain Marvel", director: "Anna Boden and Ryan Fleck"},
    {title: "Avengers: Endgame", director: "Anthony and Joe Russo"},
    {title: "Spider-Man: Far From Home", director: "Jon Watts"},
];

// GET requests

app.get("/", (req, res) => {
    res.send("Welcome to the movie app!");
});

// Get a list of data about all movies
app.get("/movies", (req, res) => {
    res.send('Successful GET request returning data on all movies');
});

// Get data about a single movie, by title
app.get('/movies/:title', (req, res) => {
    res.send('Successful GET request returning data on movie title: ' + req.params.title);
});

// Get data about a phase by title
app.get('/movies/phase/:phase', (req, res) => {
    res.send('Successful GET request returning data on phase: ' + req.params.phase);
});

// Get data about a director by name
app.get('/movies/directors/:name', (req, res) => {
    res.send('Successful GET request returning data on director: ' + req.params.name);
});

// Post new user registration
app.post('/users', (req, res) => {
    res.send('Successful POST request registering new user');
});

// Put updates to user information
app.put('/users/:userid/:username', (req, res) => {
    res.send('Successful PUT request updating user information username to ' + req.params.username + ' for user ' + req.params.userid);
});

  // Put new movie to user list of favorite movies
app.put('/users/:userid/favorites/:title', (req, res) => {
    res.send('Successful PUT request adding movie with title ' + req.params.title + ' to favorite movie list of user ' + req.params.userid);
});

  // Delete a movie from list of user's favorite movies
app.delete('/users/:userid/favorites/:title', (req, res) => {
    res.send('Successful DELETE request removing movie with title ' + req.params.title + ' from favorite movie list of user ' + req.params.userid);
});

  // Deletes a user from registration database
app.delete('/users/:userid', (req, res) => {
    res.send('Successful DELETE request removing user ' + req.params.userid + ' from database');
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});