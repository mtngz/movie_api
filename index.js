const express = require("express"),
  morgan = require("morgan"),
  mongoose = require("mongoose"),
  Models = require("./models.js"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override");
const app = express(),
  Movies = Models.Movie,
  Users = Models.User;

// Connect Mongoose to DB to allow CRUD operations within REST API
mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// express.static for documentation.html
app.use(express.static("public"));

// LOG
app.use(morgan("common"));

// Error
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// GET requests

app.get("/", (req, res) => {
  res.send("Welcome to the movie app!");
});

// Get a list of data about all movies
app.get("/movies", (req, res) => {
  res.send("Successful GET request returning data on all movies");
});

// Get data about a single movie, by title
app.get("/movies/:title", (req, res) => {
  res.send(
    "Successful GET request returning data on movie title: " + req.params.title
  );
});

// Get data about a phase by title
app.get("/movies/phase/:phase", (req, res) => {
  res.send(
    "Successful GET request returning data on phase: " + req.params.phase
  );
});

// Get data about a director by name
app.get("/movies/directors/:name", (req, res) => {
  res.send(
    "Successful GET request returning data on director: " + req.params.name
  );
});

// Post new user registration
app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Put updates to user information
app.put("/users/:userid/:username", (req, res) => {
  res.send(
    "Successful PUT request updating user information username to " +
      req.params.username +
      " for user " +
      req.params.userid
  );
});

// Put new movie to user list of favorite movies
app.put("/users/:userid/favorites/:title", (req, res) => {
  res.send(
    "Successful PUT request adding movie with title " +
      req.params.title +
      " to favorite movie list of user " +
      req.params.userid
  );
});

// Delete a movie from list of user's favorite movies
app.delete("/users/:userid/favorites/:title", (req, res) => {
  res.send(
    "Successful DELETE request removing movie with title " +
      req.params.title +
      " from favorite movie list of user " +
      req.params.userid
  );
});

// Deletes a user from registration database
app.delete("/users/:userid", (req, res) => {
  res.send(
    "Successful DELETE request removing user " +
      req.params.userid +
      " from database"
  );
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
