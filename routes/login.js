const express = require("express");
const loginRouter = express.Router();

const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;

const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const users = require("../utils/load_admins.js");

const SECRET_KEY = "SECRET_KEY";

const app = express();

app.use(passport.initialize());

//Basic Auth
async function verify(username, password, done) {
  let user = await users.find(username);
  if (!user) {
    return done(null, false, { message: "User not found" });
  }

  if (await users.verifyPassword(username, password)) {
    return done(null, user);
  } else {
    return done(null, false, { message: "Incorrect password" });
  }
}

passport.use(new BasicStrategy(verify));

//Ruta para el login y generación de token para acceder a las rutas protegidas
loginRouter.post(
  "/",
  passport.authenticate("basic", { session: false }),
  (req, res) => {
    const { username } = req.user;
    console.log("yo soy username", username);
    const role = req.user.role;

    const opts = { expiresIn: 86400 }; //token expires in 24 hours
    const token = jwt.sign({ username }, SECRET_KEY, opts);

    return res.status(200).json({ message: "Auth Passed", token, role });
  }
);

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY
};

passport.use(
  new JwtStrategy(jwtOpts, async (payload, done) => {
    const user = await users.find(payload.username);

    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: "User not found" });
    }
  })
);

module.exports = loginRouter;
