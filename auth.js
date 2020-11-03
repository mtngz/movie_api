const jwtSecret = "your_jwt_secret"; // as defined in the JWT Strategy in passport.js

const jwt = require("jsonwebtoken"),
  passport = require("passport");

require("./passport.js"); // import local passport file

// generate JWT token
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // the username to encode in the JWT
    expiresIn: "1d", //specifying the token to expire in 1 day
    algorithm: "HS256", // specifying the algorithm used to "sign" or encode the values of the JWT
  });
};

// POST log-in
module.exports = (router) => {
  router.post("/login", (req, res) => {
    // defining endpoint "/login" here
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something went wring.",
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
