const mongoose = require("mongoose"),
  bcrypt = require("bcrypt");

// create a Movie Schema

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
  Featured: Boolean,
});

// Create a User Schema

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  Favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

// initiate schemata

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

// Export

module.exports.Movie = Movie;
module.exports.User = User;
