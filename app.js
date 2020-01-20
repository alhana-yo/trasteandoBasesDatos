const app = require("./controller");

var fs = require('fs');
var https = require('https');

// const passport = require('passport');
// const BasicStrategy = require('passport-http').BasicStrategy;

// const users = require('./usersexample');

// async function verify(username, password, done) {
//     var user = await users.find(username);

//     if (!user) {
//         return done(null, false, { message: 'User not found' });
//     }

//     if (await users.verifyPassword(user, password)) {
//         return done(null, user);
//     } else {
//         return done(null, false, { message: 'Incorrect password' });
//     }
// }

// passport.use(new BasicStrategy(verify));

// app.use(passport.initialize());

// // Aquí ya vendrían los métodos CRUD que estñan en las routes de cada colección
// app.get('/ads',
//     passport.authenticate('basic', { session: false }),
//     (req, res) => {

//         console.log('Logged user:', req.user);

//         var sampleAds = [
//             { id: 0, message: "Vendo moto", author: "Pepe" },
//             { id: 1, message: "Compro TV", author: "Juan" },
//             { id: 2, message: "Cambio manta", author: "Julián" }
//         ];

//         res.json(sampleAds);
//     });

// users.init();

// https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
// }, app).listen(3443, () => {
//     console.log("Https server started in port 3443");
// });

app.listen(3000, () => console.log("Server started in port 3000"));






