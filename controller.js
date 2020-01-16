const express = require("express");
const repository = require("./repository.js");

// Creo la aplicación express
const app = express();

//Middleware
app.use(express.json());

// Routes
app.use('/blogEntries', require('./routes/entries'));
// app.use('/badwords', require('./routes/badwords'));

/**
 * Método que sustituye el id que me pone mongo:
 * le quita el _id que nos pone mongo, por el id que está esperando el API rest
 * @param {*} doc
 */
// function toResponse(doc) {
//     if (doc instanceof Array) {
//         toResponse;
//         return doc.map(elem => toResponse(elem));
//     } else {
//         let { _id, ...ret } = doc;
//         ret.id = doc._id.toString();
//         return ret;
//     }
// }

/** Métodos que definen el comportamiento de la API */

/***************** WORDS COLLECTION *********************/
//insertar una nueva palabra
// badwordRouter.get("/", async (req, res) => {
// app.get("/badwords", async (req, res) => {
//     const badwords = await repository.findAllwords();
//     res.json(badwords);
// });

// app.get("/badwords/:id", async (req, res) => {
//   const badword = await repository.findOneWord(req.params.id);
//   res.status(200).json(badword);
// });

// app.post("/badwords", async (req, res) => {
//   const badword = await repository.postOneWord(req.body);
//   res.status(200).json(badword);
// });

// app.put("/badwords/:id", async (req, res) => {
//   await repository.updateOneWord(req.params.id, req.body);
//   res.status(200);
//   res.json({
//     status: "Badword updated!"
//   });
// });

// app.delete("/badwords/:id", async (req, res) => {
//   await repository.deleteOneWord(req.params.id);
//   res.status(200);
//   res.json({
//     status: "Badword removed"
//   });
// });

/***************** END OF WORDS COLLECTION **************/

module.exports = app;
