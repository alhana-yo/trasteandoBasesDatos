// Importo MongoDB y Express

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const express = require("express");

const url = "mongodb://localhost:27017/BlogDB";

// Creo la aplicación express
const app = express();
// y la configuro para que express me parsee automáticamente bodys a json
app.use(express.json());

//let conn; // esto representa mi base de datos
let blogEntries; // esto representa la colección de las entradas del blog

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
    await blogEntries.insertOne(newBlogEntry);
    res.json(toResponse(newBlogEntry));
  }
  console.log("Post inserted");
});

//listar todos los posts sin los comentarios
app.get("/blogEntries", async (req, res) => {
  const allBlogEntries = await blogEntries
    .find(
      {},
      {
        projection: {
          postComments: 0
        }
      }
    )
    .toArray();
  // const allBlogEntries = await blogEntries.find().toArray();
  res.json(toResponse(allBlogEntries));
});

//listar un post concreto mediante su id
app.get("/blogEntries/:id", async (req, res) => {
  const id = req.params.id;
  //cuando queremos hacer una búsqueda por id, necesitamos el ObjectId
  const blogEntry = await blogEntries.findOne({ _id: new ObjectId(id) });
  if (!blogEntry) {
    res.sendStatus(404);
  } else {
    res.json(toResponse(blogEntry));
  }
});

//borrar un post concreto
app.delete("/blogEntries/:id", async (req, res) => {
  const id = req.params.id;
  const blogEntry = await blogEntries.findOne({ _id: new ObjectId(id) });
  if (!blogEntry) {
    res.sendStatus(404);
  } else {
    await blogEntries.deleteOne({ _id: new ObjectId(id) });
    res.json(toResponse(blogEntry));
  }
});

// editar un post en concreto
app.put("/blogEntries/:id", async (req, res) => {
  const id = req.params.id;
  const blogEntry = await blogEntries.findOne({ _id: new ObjectId(id) });
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
      await blogEntries.updateOne(
        { _id: new ObjectId(id) },
        { $set: newBlogEntry }
      );
      //Return new resource
      newBlogEntry.id = id;
      res.json(newBlogEntry);
    }
  }
});

// insertar un comentario con su id en un post
app.post("/blogEntries/:id/comments", async (req, res) => {
  const id = req.params.id;
  const blogEntry = await blogEntries.findOne({ _id: new ObjectId(id) });
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
      //Create object with updated fields
      // const newBlogEntry = {
      //   postComments: {
      //     ...blogEntry.postComments,
      //     newComment
      //   }
      // };

      //Agregamos una id al comentario
      const myCommentId = new ObjectId();
      newComment.commentId = myCommentId;
      //Y ponemos la fecha en la que se creó
      newComment.date = myCommentId.getTimestamp();
      blogEntry.postComments.push(newComment);
      //Update resource
      await blogEntries.updateOne(
        { _id: new ObjectId(id) },
        { $set: blogEntry }
        // { $set: newblogEntry }
      );
      //Return new resource
      blogEntry.id = id;
      res.json(blogEntry);
      // newBlogEntry.id = id;
      // res.json(newBlogEntry);
    }
  }
});

// app.post("/blogEntries/:id/comments/:commentId" --> otro nombre de id para que no se haga la picha un lio
// editar un comentario: usamos la id del post y la id del comentario.
app.put("/blogEntries/:id/comments/:commentId", async (req, res) => {
  const id = req.params.id;
  let blogEntry = await blogEntries.findOne({ _id: new ObjectId(id) });
  console.log("El post que quiero editar es el: ", blogEntry);
  if (!blogEntry) {
    console.log("No existe el post");
    res.sendStatus(404);
  } else {
    const updatedCommentInfo = req.body;
    console.log("La info que quiero editar es: ", updatedCommentInfo);

    //Sacamos la id del comentario a editar
    const commentForUpdatingId = req.params.commentId;

    /////////////////////
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
    console.log("comentario editado", newCommentInfo);
    ////////////////

    const query = {
      _id: new ObjectId(id),
      "postComments.commentId": new ObjectId(commentForUpdatingId)
    };

    const newValues = {
      $set: { "postComments.$": newCommentInfo }
    };

    const commentForUpdating = await blogEntries.updateOne(query, newValues);

    console.log("después de actualizarlo con updateOne", commentForUpdating);
    //Validacion del comentario a editar
    if (!commentForUpdating) {
      console.log("No existe el comentario a editar");
      res.sendStatus(404);
    } else {
      blogEntry = await blogEntries.findOne({ _id: new ObjectId(id) });
      res.json(toResponse(blogEntry));
      console.log("todo ha ido ok");
    }
  }
});

//borra el comentario de un post, según su id
app.delete("/blogEntries/:id/comments/:commentId", async (req, res) => {
  const id = req.params.id;
  let blogEntry = await blogEntries.findOne({ _id: new ObjectId(id) });
  console.log("El post que quiero editar es el: ", blogEntry);
  if (!blogEntry) {
    console.log("No existe el post");
    res.sendStatus(404);
  } else {
    //Sacamos la id del comentario a borrar
    const commentForUpdatingId = req.params.commentId;
    console.log("La ide del comentario a borrar es", commentForUpdatingId);

    const query = {
      _id: new ObjectId(id),
      "postComments.commentId": new ObjectId(commentForUpdatingId)
    };

    const itemToDelete = {
      $pull: { postComments: { commentId: new ObjectId(commentForUpdatingId) } }
    };

    const commentForUpdating = await blogEntries.updateOne(query, itemToDelete);

    console.log("El cometario editado es este", commentForUpdating);
    //Validacion del comentario a editar
    if (!commentForUpdating) {
      console.log("No existe el comentario a editar");
      res.sendStatus(404);
    } else {
      blogEntry = await blogEntries.findOne({ _id: new ObjectId(id) });
      res.json(toResponse(blogEntry));
      console.log("todo ha ido ok");
    }
  }
});

async function dbConnect() {
  //creo la conexión a la base de datos (la arranco)
  let conn = await MongoClient.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

  console.log("Connected to Mongo");
  //Justo después que se conecte la base de datos, inicializo esta variable: la colección de anuncios de la conexión a la base de datos (conn)
  //esto lo tengo que hacer antes de que ads se use en cualquiera de los métodos, para poder guardar o borrar o editar o consultar cualquier cosa de esa colección.
  blogEntries = conn.db().collection("blogEntries");
  //si yo necesitara acceder a otra colección , podría hacerlo de la misma manera de arriba ¿??¿?
}
async function main() {
  await dbConnect(); //espera a que se conecte la base de datos
  //y luego levanta express
  //   app.listen(3000, () => console.log("Server started in port 3000"));
}

main();

module.exports = app;
