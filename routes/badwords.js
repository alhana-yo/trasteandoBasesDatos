const express = require('express');
const badwordRouter = express.Router();

const repository = require("../repository.js");

badwordRouter.get("/", async (req, res) => {
    const badwords = await repository.findAllwords();
    res.json(badwords);
});

badwordRouter.get("/:id", async (req, res) => {
    const badword = await repository.findOneWord(req.params.id);
    res.status(200).json(badword);
});

badwordRouter.post("/", async (req, res) => {
    const badword = await repository.postOneWord(req.body);
    console.log(badword);
    res.status(200).json(badword);
});

badwordRouter.put("/:id", async (req, res) => {
    await repository.updateOneWord(req.params.id, req.body);
    res.status(200);
    res.json({
        status: "Badword updated!"
    });
});

badwordRouter.delete("/:id", async (req, res) => {
    await repository.deleteOneWord(req.params.id);
    res.status(200);
    res.json({
        status: "Badword removed"
    });
});

module.exports = badwordRouter;