
// const Register = require('../models/register');
// const defAdmin = require('../defAdmin');

// exports.addUser = async function (user) {
//     const { nickname, password, username, role = "publisher" } = user;
//     const passwordHash = await bcrypt.hash(password, bcrypt.genSaltSync(8), null);

//     var user = await User.findOne({ username }).exec();

//     if (!user) {
//         user = new User({ username, passwordHash, role, nickname });
//     } else {
//         user.passwordHash = passwordHash;
//     }

//     await user.save();
// }

// exports.registerNewUser = function (req, res) {
//     let register = new Register();
//     register.username = req.body.username;
//     register.nickname = req.body.nickname;
//     register.password = req.body.password;
//     register.role = 'publisher';

//     register.save((err, register) => {
//         if (err) res.status(500).send({ message: `Sign in error: ${err}` });
//     })

//     res.status(200).send({ message: 'the user has successfully registered', register });
//     addUser(register.username, register.password, register.role, register.nickname);

// }
// addUser(defAdmin.username, defAdmin.password, defAdmin.role, defAdmin.nickname);