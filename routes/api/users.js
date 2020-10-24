const express = require("express");
const router = express.Router();
const JWT = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
//const gravatar = require("gravatar");
//const normalize = require("normalize-url");
const passport = require("passport");

require("../../config/passport");
const User = require("../../models/User");

const secret = config.get("jwtSecret");

const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return JWT.sign({ sub: user.id, iat: timestamp }, secret);
};

//! Sign Up
router.post(
  "/signup",
  [
    [
      check("email", "Please include a valid email").isEmail(),
      check("password", "Password is required").exists(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role = "user" } = req.body;

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).send({ msg: "Failed to register" });
      }
      const user = new User({
        email,
        password,
        role,
      });
      const newUser = await user.save();
      res.status(201).send({
        token: tokenForUser(newUser),
      });
    } catch (err) {
      res.status(500).send("Server Error");
    }
  }
);

//! Sign In
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    try {
      res.status(201).send({ token: tokenForUser(req.user) });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }
);

//! Me
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user);
    res.status(201).send({ token: tokenForUser(req.user), user: req.user });
  }
);

//! Demo
//#region
/**
 * @swagger
 * /api/users:
 *  get:
 *    description: Access Public - Logout User
 *    produces:
 *       - application/json
 *    responses:
 *      200:
 *        description: A successful response
 *      500:
 *        description: Internal Server Error
 */
//#endregion
router.get(
  "/demo",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      res.clearCookie("access_token");
      res.json({ user: { email: "", role: "" }, success: true });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
