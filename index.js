const express = require('express');
const app = express();

app.use(express.static("public"));

let topMovies = [
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

app.get("/movies", (req, res) => {
    res.json(topMovies);
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});