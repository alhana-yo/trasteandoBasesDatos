const express = require("express");
//const insertBlogEntry = require("./repository").insertBlogEntry;
const repository = require("./repository.js");

// Creo la aplicación express
const app = express();
// const badwordRouter = express.Router();

// // Routes
// app.use('/entries', require('./repository'));
// app.use('/badwords', require('./routes/badwords'));

// y la configuro para que express me parsee automáticamente bodys a json
app.use(express.json());

//sustituye el id que me pone mongo: le quita el _id que nos pone mongo, por el id que está esperando el API rest
function toResponse(doc) {
  if (doc instanceof Array) {
    toResponse;
    return doc.map(elem => toResponse(elem));
  } else {
    let { _id, ...ret } = doc;
    ret.id = doc._id.toString();
    return ret;
  }
}

/** Métodos que definen el comportamiento de la API */

/***************** BLOGENTRIES COLLECTION *********************/

//insertar una entrada de blog
app.post("/blogEntries", async (req, res) => {
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
  console.log("Post inserted");
});

//listar todos los posts sin los comentarios
app.get("/blogEntries", async (req, res) => {
  const allBlogEntries = await repository.listBlogEntries();
  res.json(toResponse(allBlogEntries));
});

//listar un post concreto mediante su id
app.get("/blogEntries/:id", async (req, res) => {
  const id = req.params.id;
  //cuando queremos hacer una búsqueda por id, necesitamos el ObjectId
  const blogEntry = await repository.findPost(id);
  if (!blogEntry) {
    res.sendStatus(404);
  } else {
    res.json(toResponse(blogEntry));
  }
});

//borrar un post concreto
app.delete("/blogEntries/:id", async (req, res) => {
  const id = req.params.id;
  const blogEntry = await repository.findPost(id);
  if (!blogEntry) {
    res.sendStatus(404);
  } else {
    // await blogEntries.deleteOne({ _id: new ObjectId(id) });
    await repository.deletePost(id);
    res.json(toResponse(blogEntry));
  }
});

// editar un post en concreto
app.put("/blogEntries/:id", async (req, res) => {
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
});

// insertar un comentario con su id en un post
app.post("/blogEntries/:id/comments", async (req, res) => {
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
      console.log("no se hace bien la validacion");
      res.sendStatus(400);
    } else {
      await repository.addNewComment(id, blogEntry, newComment);

      //Return new resource
      blogEntry.id = id;
      res.json(blogEntry);
    }
  }
});

// editar un comentario: usamos la id del post y la id del comentario.
app.put("/blogEntries/:id/comments/:commentId", async (req, res) => {
  const id = req.params.id;
  let blogEntry = await repository.findPost(id);
  if (!blogEntry) {
    console.log("No existe el post");
    res.sendStatus(404);
  } else {
    const updatedCommentInfo = req.body;
    //Sacamos la id del comentario a editar
    const commentForUpdatingId = req.params.commentId;

    //Selecciono el comentario a editar
    const oldComment = blogEntry.postComments.find(
      element => element.commentId == commentForUpdatingId
    );
    console.log("old comment", oldComment);

    //Aquí construyo un objeto nuevo con la info del comentario: si tengo algo nuevo que añadir, pongo lo nuevo, sino, pongo lo que había antes
    const newCommentInfo = {
      nickname: updatedCommentInfo.nickname || oldComment.nickname,
      text: updatedCommentInfo.text || oldComment.text,
      commentId: updatedCommentInfo.commentId || oldComment.commentId,
      date: updatedCommentInfo.date || oldComment.date
    };

    const commentForUpdating = await repository.updateComment(
      id,
      commentForUpdatingId,
      newCommentInfo
    );

    //Validacion del comentario a editar
    if (!commentForUpdating) {
      console.log("No existe el comentario a editar");
      res.sendStatus(404);
    } else {
      //blogEntry = await blogEntries.findOne({ _id: new ObjectId(id) });
      blogEntry = await repository.findPost(id);
      res.json(toResponse(blogEntry));
      console.log("todo ha ido ok");
    }
  }
});

//borra el comentario de un post, según su id
app.delete("/blogEntries/:id/comments/:commentId", async (req, res) => {
  const id = req.params.id;
  let blogEntry = await repository.findPost(id);

  if (!blogEntry) {
    console.log("No existe el post");
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
      console.log("No existe el comentario a editar");
      res.sendStatus(404);
    } else {
      blogEntry = await repository.findPost(id);
      res.json(toResponse(blogEntry));
      console.log("todo ha ido ok");
    }
  }
});

/***************** END OF BLOGENTRIES COLLECTION *********************/

/***************** WORDS COLLECTION *********************/
//insertar una nueva palabra
// badwordRouter.get("/", async (req, res) => {
app.get("/badwords", async (req, res) => {
  const badwords = await repository.findAllwords();
  res.json(badwords);
});

app.get("/badwords/:id", async (req, res) => {
  const badword = await repository.findOneWord(req.params.id);
  res.status(200).json(badword);
});

app.post("/badwords", async (req, res) => {
  const badword = await repository.postOneWord(req.body);
  res.status(200).json(badword);
});

app.put("/badwords/:id", async (req, res) => {
  await repository.updateOneWord(req.params.id, req.body);
  res.status(200);
  res.json({
    status: "Badword updated!"
  });
});

app.delete("/badwords/:id", async (req, res) => {
  await repository.deleteOneWord(req.params.id);
  res.status(200);
  res.json({
    status: "Badword removed"
  });
});

/***************** END OF WORDS COLLECTION **************/

module.exports = app;
