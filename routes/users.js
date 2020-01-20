const express = require('express');
const userRouter = express.Router();

const repository = require("../repository.js");
// const passport = require('passport');

// Aquí ya vendrían los métodos CRUD que estñan en las routes de cada colección
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




userRouter.get("/", async (req, res) => {
    // console.log('Logged user:', req.user);
    const user = await repository.findAllusers();
    res.json(user);
});


userRouter.get("/:id", async (req, res) => {
    // console.log('Logged user:', req.user);
    const user = await repository.findOneUser(req.params.id);
    (!user) ? res.json({ status: "User Not Found" }) : res.json(user);
});

userRouter.post("/", async (req, res) => {
    // console.log('Logged user:', req.user);
    const user = await repository.postOneUser(req.body);
    res.json(user);
});

module.exports = userRouter;