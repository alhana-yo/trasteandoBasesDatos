const express = require('express');
const badwordRouter = express.Router();
const passport = require("passport");

const repository = require('../repositories/badwords.js');
const checkRole = require('../utils/checkRole.js');

badwordRouter.get("/", async (req, res) => {
    const badwords = await repository.findAllwords();
    res.status(200).json(badwords);
});


badwordRouter.get("/:id", async (req, res) => {
    const badword = await repository.findOneWord(req.params.id);
    (!badword)
        ? res.status(404).json({ msg: "Badword Not Found" })
        : res.status(200).json(badword);
});

badwordRouter.post("/", passport.authenticate('jwt', { session: false }), async (req, res) => {
    const badword = await repository.postOneWord(req.body);
    res.status(200).json(badword);
});

badwordRouter.put("/:id", passport.authenticate('jwt', { session: false }), checkRole, async (req, res) => {
    const badword = await repository.updateOneWord(req.params.id, req.body);
    (badword)
        ? res.status(200).json({ msg: "Badword updated" })
        : res.status(404).json({ msg: "Can't update, badword not found" })
});

badwordRouter.delete("/:id", passport.authenticate('jwt', { session: false }), checkRole, async (req, res) => {
    const badword = await repository.deleteOneWord(req.params.id);
    (badword)
        ? res.status(200).json({ msg: "Badword removed" })
        : res.status(404).json({ msg: "Can't delete, badword not found" })
});

module.exports = badwordRouter;