const express = require("express"),
  morgan = require("morgan"),
  mongoose = require("mongoose"),
  Models = require("./models.js"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override");

const { check, validationResult } = require("express-validator");
const path = require("path");

const app = express(),
  Movies = Models.Movie,
  Users = Models.User;

// Connect Mongoose to DB to allow CRUD operations within REST API
// local
/*
mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
*/

// heroku
mongoose.connect(process.env.CONNECTION_URI, {
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

const passport = require("passport");
require("./passport");

// CORS
const cors = require("cors");

let allowedOrigins = [
  "http://localhost:1234",
  "https://marvelix.herokuapp.com",
  "http://localhost:4200",
  "https://mtngz.github.io",
  "https://mean-marvelix.netlify.app",
  "http://localhost:3000",
  "https://mern-marvelix.netlify.app/",
];

/**
 * CORS blocks requests from origins not listed in 'allowedOrigins'
 */
app.use(
  cors({
    origin: (origin, callback) => {
      console.log(origin, allowedOrigins.indexOf(origin) === -1);
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application does not allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

/**
 * imports auth.js containing api call to login endpoint and authentication
 */
let auth = require("./auth.js")(app); // import auth; has to be placed AFTER bodyParser middleware function "app.use(bodyParser.json();"

// GET requests

/**
 * API call to homepage
 * here forwarded to documentation.html
 */
app.get("/", (req, res) => {
  res.sendFile(path.resolve("./public/documentation.html"));
});

// Get a list of data about all movies
/**
 * API call to endpoint /movies
 * to GET a JSON object holding data about all movies
 */
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get data about a single movie, by title
/**
 * API call to endpoint /movies/:Title
 * to GET a JSON object holding data about a single movie
 */
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get data about a phase by title
/**
 * API call to endpoint /movies/phases/:Title
 * to GET a JSON object holding data about a phase
 */
app.get(
  "/movies/phases/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(
          "Phase: " +
            movie.Phase.Name +
            ". Description: " +
            movie.Phase.Description
        );
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get data about a director by name
/**
 * API call to endpoint /movies/directors/:Name
 * to GET a JSON object holding data about a phase
 */
app.get(
  "/movies/directors/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.Name })
      .then((movie) => {
        res.json(
          "Name: " +
            movie.Director.Name +
            ". Bio: " +
            movie.Director.Bio +
            " Birth: " +
            movie.Director.Birth +
            ". Death: " +
            movie.Director.Death +
            "."
        );
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Post new user registration
/**
 * API call to endpoint /users
 * to create (POST) a new user
 *
 * @param {string} Username - name chosen by user
 * @param {string} Password - alpanumeric password, hashed in DB
 * @param {string} Email - user's e-mail
 * @param {string} Birthday - user's birthday, saved as ISO-Date
 * @returns {object} user
 */
app.post(
  "/users",
  // Validation logic here for request (express-validation as middleware)
  [
    check("Username", "Username is required.").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required.").not().isEmpty(),
    check("Email", "Email does not appear to be valid.").isEmail(),
  ],
  (req, res) => {
    //check the validation objects for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
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
  }
);

/*
// Disable "Get all Users" and "Get a user by username"
// Get all Users
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);
*/

// Get a user by username
/**
 * API call to endpoint /users/:Username
 * to GET a JSON object holding data about a single user
 */
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Put updates to user information
/**
 * API call to endpoint /users
 * to update (PUT) an existing user
 *
 * @param {string} Username - name chosen by user
 * @param {string} Password - alpanumeric password, hashed in DB
 * @param {string} Email - user's e-mail
 * @param {string} Birthday - user's birthday, saved as ISO-Date
 * @returns {object} updatedUser
 */
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Post new movie to user list of favorite movies
/**
 * API call to endpoint /users/:Username/Favorites/:MovieID
 * to POST a movie ID to a user's favorites
 *
 * @param {string} Username - username of current user
 * @param {ObjectID} MovieID - ID of the movie to be added to user's favorites
 * @returns {object} updatedUser
 */
app.post(
  "/users/:Username/Favorites/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { Favorites: req.params.MovieID },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Delete a movie from list of user's favorite movies
/**
 * API call to endpoint /users/:Username/Favorites/:MovieID
 * to DELETE a movie ID from a user's favorites
 *
 * @param {string} Username - username of current user
 * @param {ObjectID} MovieID - ID of the movie to be deleted from user's favorites
 * @returns {object} updatedUser
 */
app.delete(
  "/users/:Username/Favorites/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { Favorites: req.params.MovieID },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Deletes a user from registration database
/**
 * API call to endpoint /users/:Username
 * to DELETE a user (profile) form the database
 */
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
