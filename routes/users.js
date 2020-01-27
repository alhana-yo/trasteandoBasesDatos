const express = require('express');
const userRouter = express.Router();

const repository = require('../repositories/users.js');

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