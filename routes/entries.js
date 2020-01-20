const express = require("express");
const entryRouter = express.Router();

const repository = require("../repository.js");
const toResponse = require("../toResponse.js");
const validator = require("../validator.js").validator;
const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;

/**
 * function that verifys users
 */
function verify(username, password, done) {
  if (username == "admin" && password == "pass") {
    return done(null, { username, password });
  } else {
    return done(null, false, { message: "Incorrect username or password" });
  }
}

passport.use(new BasicStrategy(verify));
//Uno passport al propio express
entryRouter.use(passport.initialize());

/**
 * Function that checks if there are forbidden words into a comment
 * @param {*} comment
 */
async function hasBadWord(comment) {
  const badwords = await repository.findAllwords();
  const result = validator(comment, badwords);
  return result;
}

entryRouter.post(
  "/",
  passport.authenticate("basic", { session: false }),
  async (req, res) => {
    const blogEntry = req.body;
    //valido que la entrada del blog es correcta
    if (
      typeof blogEntry.name != "string" ||
      typeof blogEntry.postText != "string"
    ) {
      res.sendStatus(400);
    } else {
      const newBlogEntry = {
        name: blogEntry.name,
        lastName: blogEntry.lastName,
        nickname: blogEntry.nickname,
        postTitle: blogEntry.postTitle,
        postText: blogEntry.postText,
        postComments: blogEntry.postComments
      };

      //inserto el anuncio nuevo en la colección de la base de datos
      repository.insertBlogEntry(newBlogEntry);
      res.json(toResponse(newBlogEntry));
    }
  }
);

//listar todos los posts sin los comentarios
entryRouter.get("/", async (req, res) => {
  const allBlogEntries = await repository.listBlogEntries();
  res.json(toResponse(allBlogEntries));
});

//listar un post concreto mediante su id
entryRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const blogEntry = await repository.findPost(id);
  if (!blogEntry) {
    res.sendStatus(404);
  } else {
    res.json(toResponse(blogEntry));
  }
});

//borrar un post concreto
entryRouter.delete(
  "/:id",
  passport.authenticate("basic", { session: false }),
  async (req, res) => {
    const id = req.params.id;
    const blogEntry = await repository.findPost(id);
    if (!blogEntry) {
      res.sendStatus(404);
    } else {
      await repository.deletePost(id);
      res.json(toResponse(blogEntry));
    }
  }
);

// editar un post en concreto
entryRouter.put(
  "/:id",
  passport.authenticate("basic", { session: false }),
  async (req, res) => {
    const id = req.params.id;
    const blogEntry = await repository.findPost(id);
    if (!blogEntry) {
      res.sendStatus(404);
    } else {
      const updatedBlogEntry = req.body;
      //Validation
      if (
        typeof updatedBlogEntry.name != "string" ||
        typeof updatedBlogEntry.postText != "string"
      ) {
        res.sendStatus(400);
      } else {
        //Create object with needed fields and assign id

        const newBlogEntry = {
          name: updatedBlogEntry.name || blogEntry.name,
          lastName: updatedBlogEntry.lastName || blogEntry.lastName,
          nickname: updatedBlogEntry.nickname || blogEntry.nickname,
          postTitle: updatedBlogEntry.postTitle || blogEntry.postTitle,
          postText: updatedBlogEntry.postText || blogEntry.postText
        };

        //Update resource
        await repository.updatePost(id, newBlogEntry);
        //Return new resource
        newBlogEntry.id = id;
        res.json(newBlogEntry);
      }
    }
  }
);

// insertar un comentario con su id en un post
entryRouter.post(
  "/:id/comments",
  passport.authenticate("basic", { session: false }),
  async (req, res) => {
    const id = req.params.id;
    const blogEntry = await repository.findPost(id);
    if (!blogEntry) {
      res.sendStatus(404);
    } else {
      const newComment = req.body;
      //Validation
      if (
        typeof newComment.nickname != "string" ||
        typeof newComment.text != "string"
      ) {
        res.sendStatus(400);
      } else {
        const result = await hasBadWord(newComment.text);

        if (!result.isIncluded) {
          await repository.addNewComment(id, blogEntry, newComment);
          //Return new resource
          blogEntry.id = id;
          res.json(blogEntry);
        } else {
          const includedWords = { words: [] };

          result.forbiddenWords.forEach(element => {
            let badWordInComment = {};
            badWordInComment.badword = element.badword;
            badWordInComment.level = element.level;
            includedWords.words.push(badWordInComment);
          });

          // res.sendStatus(400)
          res.status(400).json(includedWords);
        }
      }
    }
  }
);

// editar un comentario: usamos la id del post y la id del comentario.
entryRouter.put(
  "/:id/comments/:commentId",
  passport.authenticate("basic", { session: false }),
  async (req, res) => {
    const id = req.params.id;
    let blogEntry = await repository.findPost(id);
    if (!blogEntry) {
      res.sendStatus(404);
    } else {
      const updatedCommentInfo = req.body;
      //Sacamos la id del comentario a editar
      const commentForUpdatingId = req.params.commentId;

      //Selecciono el comentario a editar
      const oldComment = blogEntry.postComments.find(
        element => element.commentId == commentForUpdatingId
      );

      //Aquí construyo un objeto nuevo con la info del comentario: si tengo algo nuevo que añadir, pongo lo nuevo, sino, pongo lo que había antes
      const newCommentInfo = {
        nickname: updatedCommentInfo.nickname || oldComment.nickname,
        text: updatedCommentInfo.text || oldComment.text,
        commentId: updatedCommentInfo.commentId || oldComment.commentId,
        date: updatedCommentInfo.date || oldComment.date
      };

      //comprobamos si el comentario tiene palabras prohibidas
      const result = await hasBadWord(newCommentInfo.text);

      if (!result.isIncluded) {
        await repository.updateComment(
          id,
          commentForUpdatingId,
          newCommentInfo
        );
        //Return updated resource

        blogEntry = await repository.findPost(id);
        res.status(200).json(toResponse(blogEntry));
      } else {
        const includedWords = { words: [] };

        result.forbiddenWords.forEach(element => {
          let badWordInComment = {};
          badWordInComment.badword = element.badword;
          badWordInComment.level = element.level;
          includedWords.words.push(badWordInComment);
        });

        res.status(400).json(includedWords);
      }
    }
  }
);

//borra el comentario de un post, según su id
entryRouter.delete(
  "/:id/comments/:commentId",
  passport.authenticate("basic", { session: false }),
  async (req, res) => {
    const id = req.params.id;
    let blogEntry = await repository.findPost(id);

    if (!blogEntry) {
      res.sendStatus(404);
    } else {
      //Sacamos la id del comentario a borrar
      const commentForDeletingId = req.params.commentId;

      const commentForDeleting = await repository.deleteComment(
        id,
        commentForDeletingId
      );

      //Validacion del comentario a editar
      if (!commentForDeleting) {
        res.sendStatus(404);
      } else {
        blogEntry = await repository.findPost(id);
        res.status(200).json(toResponse(blogEntry));
      }
    }
  }
);

module.exports = entryRouter;
