const mongoose = require("mongoose"),
  bcrypt = require("bcrypt");

// create a Movie Schema
/**
 * Movie Schema for Data Base
 *
 * @param {string} Title - Movie title
 * @param {string} Description - Movie description
 * @param {string} Phase.Name - Phase name
 * @param {string} Phase.Description - Phase description
 * @param {string} Director.Name - Director name
 * @param {string} Director.Bio - Director bio
 * @param {string} Direector.Birth - Birth year of direcctor
 * @param {string} Direector.Death - Death year of direcctor
 * @param {string} ImagePath - link to the image of the movie
 * @param {Date} Release - Date of movie release in ISO-Date format
 * @param {boolean} Featured - a bolean variable
 *
 */
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Phase: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: Number,
    Death: Number,
  },
  ImagePath: String,
  Release: Date,
  Featured: Boolean,
});

// Create a User Schema
/**
 * User Schema for Data Base
 *
 * @param {string} Username - User's Username
 * @param {string} Password - User's Password
 * @param {string} Email - User's Email
 * @param {data} Birthday - User's birthday
 *
 */
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  Favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

/**
 * hashes user password to be stored in db
 * @param password
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * compares user's login passoword with hashed stored password
 * @param password
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

// initiate schemata

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

// Export

module.exports.Movie = Movie;
module.exports.User = User;
