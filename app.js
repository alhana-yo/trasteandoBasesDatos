const fs = require("fs");
const https = require("https");

const server = require("./controller");
const loginRouter = require("./routes/login");
const users = require("./repositories/users");

const express = require("express");

const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");

const SECRET_KEY = "SECRET_KEY";

const app = express();

app.use(passport.initialize());

//Basic Auth
async function verify(username, password, done) {
  console.log("Verify: me estas usando", username, password);

  const user = await users.find(username);

  if (!user) {
    return done(null, false, { message: "User not found" });
  }

  if (await users.verifyPassword(user, password)) {
    return done(null, user);
  } else {
    return done(null, false, { message: "Incorrect password" });
  }
}

passport.use(new BasicStrategy(verify));

//Login y generación de token para acceder a las rutas protegidas
// loginRouter.post(
//   "/login",
//   passport.authenticate("basic", { session: false }),
//   (req, res) => {
//     const { username } = req.user;

//     const opts = { expiresIn: 120 }; //token expires in 2min
//     const token = jwt.sign({ username }, SECRET_KEY, opts);

//     return res.status(200).json({ message: "Auth Passed", token });
//   }
// );

// const jwtOpts = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: SECRET_KEY
// };

// passport.use(
//   new JwtStrategy(jwtOpts, async (payload, done) => {
//     const user = await users.find(payload.username);

//     if (user) {
//       return done(null, user);
//     } else {
//       return done(null, false, { message: "User not found" });
//     }
//   })
// );

https
  .createServer(
    {
      key: fs.readFileSync("server.key"),
      cert: fs.readFileSync("server.cert")
    },
    server
  )
  .listen(3443, () => {
    console.log("Https server started in port 3443");
  });
