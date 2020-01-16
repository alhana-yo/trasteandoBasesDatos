const express = require("express");
const repository = require("./repository.js");

// Creo la aplicación express
const app = express();

//Middleware
app.use(express.json());

// Routes
app.use('/blogEntries', require('./routes/entries'));
app.use('/badwords', require('./routes/badwords'));

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

module.exports = app;
