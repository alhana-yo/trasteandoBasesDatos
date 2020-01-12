// Importo Mongoose y Express

//const MongoClient = require("mongodb").MongoClient;
//const ObjectId = require("mongodb").ObjectId;
var mongoose = require("mongoose");
const express = require("express");

const url = "mongodb://localhost:27017/BlogDB";

// Creo la aplicación express
const app = express();
// y la configuro para que express me parsee automáticamente bodys a json
app.use(express.json());

//let blogEntries; // esto representa la colección de las entradas del blog
let BlogEntry;
//sustituye el id que me pone mongo: le quita el _id que nos pone mongo, por el id que está esperando el API rest
function toResponse(doc) {
  if (doc instanceof Array) {
    return doc.map(elem => toResponse(elem));
  } else {
    let ret = doc.toObject({ versionKey: false });
    ret.id = ret._id.toString();
    delete ret._id;
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
    const newBlogEntry = new BlogEntry({
      name: blogEntry.name,
      lastName: blogEntry.lastName,
      nickname: blogEntry.nickname,
      postTitle: blogEntry.postTitle,
      postText: blogEntry.postText,
      postComments: blogEntry.postComments
    });

    //inserto el post nuevo en la colección de la base de datos
    await newBlogEntry.save();
    res.json(toResponse(newBlogEntry));
  }
  console.log("Post inserted");
});

//listar todos los posts sin los comentarios
app.get("/blogEntries", async (req, res) => {
  // const allBlogEntries = await BlogEntry.find(
  //   {},
  //   {
  //     projection: {
  //       postComments: 0
  //     }
  //   }
  // )
  // .exec();
  //esto no funciona
  //const allBlogEntries = await BlogEntry.find("name lastname").exec();
  const allBlogEntries = await BlogEntry.find().exec();
  res.json(toResponse(allBlogEntries));
});

//listar un post concreto mediante su id
app.get("/blogEntries/:id", async (req, res) => {
  const id = req.params.id;
  const blogEntry = await BlogEntry.findById({ _id: id });
  if (!blogEntry) {
    res.sendStatus(404);
  } else {
    res.json(toResponse(blogEntry));
  }
});

//borrar un post concreto
app.delete("/blogEntries/:id", async (req, res) => {
  const id = req.params.id;
  const blogEntry = await BlogEntry.findById({ _id: id });
  console.log("ESta es la entrada que euireo borrar", blogEntry);
  if (!blogEntry) {
    res.sendStatus(404);
  } else {
    await BlogEntry.findByIdAndDelete({ _id: id });
    res.json(toResponse(blogEntry));
    console.log("Todo ha ido bien");
  }
});

// editar un post en concreto
app.put("/blogEntries/:id", async (req, res) => {
  const id = req.params.id;
  //const blogEntry = await blogEntries.findOne({ _id: new ObjectId(id) });
  const blogEntry = await BlogEntry.findById({ _id: id });

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
        name: updatedBlogEntry.name,
        lastName: updatedBlogEntry.lastName,
        nickname: updatedBlogEntry.nickname,
        postTitle: updatedBlogEntry.postTitle,
        postText: updatedBlogEntry.postText
      };
      //Update resource
      await BlogEntry.findByIdAndUpdate({ _id: id }, { $set: newBlogEntry });
      //Return new resource
      newBlogEntry.id = id;
      res.json(newBlogEntry);
    }
  }
});

// insertar un comentario con su id
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

//Para el resto de funciones de comentario, como el editar y el borrar el comentario, va por id, tendría qu eponer:
// app.post("/blogEntries/:id/comments/:commentId" --> otro nombre de id para que no se haga la picha un lio
// NO FUNCIONA: editar un comentario: usamos la id del post y la id del comentario.
app.put("/blogEntries/:id/comments/:commentId", async (req, res) => {
  const id = req.params.id;
  const blogEntry = await blogEntries.findOne({ _id: new ObjectId(id) });
  console.log("El post que quiero editar es el: ", blogEntry);
  if (!blogEntry) {
    console.log("No existe el post");
    res.sendStatus(404);
  } else {
    const updatedCommentInfo = req.body;
    console.log("La info que quiero editar es: ", updatedCommentInfo);

    //Sacamos la id del comentario a editar
    const commentForUpdatingId = req.params.commentId;

    console.log("El comentario que quiero editar es el: ", commentForUpdating);

    //Buscamos el comentario a editar
    //falla aqui, en la búsqueda del comentario.
    const query = {
      postComments: commentForUpdatingId
    };
    const commentForUpdating = await blogEntry.postComments.find(query);
    //Validacion del comentario a editar
    if (!commentForUpdating) {
      console.log("No existe el comentario a editar");
      res.sendStatus(404);
    } else {
      //validación de la nueva info del comentario
      if (
        // typeof updatedCommentInfo.nickname != "string" ||
        // typeof updatedCommentInfo.text != "string"
        false
      ) {
        res.sendStatus(400);
      } else {
        console.log("Por ahora todo va bien");
        /*
        //Creamos un objeto con la nueva info del comentario
        const updatedComment = {
          nickname: updatedCommentInfonickname,
          text: updatedCommentInfo.text,
          date: new ObjectId().getTimestamp()
        };

        //Update resource ///
        await blogEntry.postComments.updateOne(
          { _id: new ObjectId(id) },
          { $set: newblogEntry }
        );
        //Return new resource

        newBlogEntry.id = id;
        res.json(newBlogEntry);
        */
      }
    }
  }
});

async function dbConnect() {
  //creo la conexión a la base de datos (la arranco)
  await mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
  });

  console.log("Connected to Mongo");

  var blogEntrySchema = new mongoose.Schema({
    name: String,
    lastName: String,
    nickname: String,
    postTitle: String,
    postText: String,
    postComments: Array
  });

  BlogEntry = mongoose.model("BlogEntry", blogEntrySchema);
}

async function main() {
  await dbConnect(); //espera a que se conecte la base de datos
  //y luego levanta express
  app.listen(3000, () => console.log("Server started in port 3000"));
}

main();
