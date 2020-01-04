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

//listar todos los posts
app.get("/blogEntries", async (req, res) => {
  const allBlogEntries = await blogEntries.find().toArray();
  res.json(toResponse(allBlogEntries));
});

/** 

async function insertOneWithId() {
  const { insertedId } = await blogEntries.insertOne({
    name: "Jack",
    lastName: "Bauer",
    nickname: "ppppp",
    postTitle: "el primero",
    postText: "lallalalalalallala",
    postComments: [
      {
        nickname: "pichi",
        text: "primer comen de debugger;bugger;tario",
        date: "2/01/2020"
      }
    ]
  });

  console.log("Post inserted with id:", insertedId);
  console.log("esteeeeeeeeeeeee es el id", insertedId);
  debugger;
  //devuelve el id, porque en otro ejemplo posterior, va a borrar este elemento
  return insertedId;
}

async function insertMany() {
  await blogEntries.insertMany([
    {
      name: "Jack",
      lastName: "Bauer",
      nickname: "lolo",
      postTitle: "el gato",
      postText: "uueee",
      postComments: [
        { nickname: "gala", text: "otro comentario", date: "26/12/2019" }
      ]
    },
    {
      name: "Juan",
      lastName: "Pérez",
      nickname: "ppppp",
      postTitle: "el tercero",
      postText: "lallla",
      postComments: [
        { nickname: "pic", text: "y otro comentario", date: "2/02/2019" }
      ]
    }
  ]);

  console.log("blogEntries inserted");
}

async function insertManyWithId() {
  const { insertedIds } = await blogEntries.insertMany([
    {
      name: "Jack",
      lastName: "Bauer",
      nickname: "lolo",
      postTitle: "el gato",
      postText: "uueee",
      postComments: [
        { nickname: "gala", text: "otro comentario", date: "26/12/2019" }
      ]
    },
    {
      name: "Juan",
      lastName: "Pérez",
      nickname: "ppppp",
      postTitle: "el tercero",
      postText: "lallla",
      postComments: [
        { nickname: "pic", text: "y otro comentario", date: "2/02/2019" },
        { nickname: "thor", text: "agua augua auau ", date: "2/02/2018" }
      ]
    }
  ]);

  console.log("blogEntries inserted with ids:", insertedIds);
}

async function findPostWithQuery() {
  const result = await blogEntries.find({ name: "Juan" }).toArray();

  console.log('blogEntries with firstName = "Juan":', result);
}

async function findPostById(id) {
  const post = await blogEntries.findOne({ _id: new ObjectId(id) });

  console.log("Post with id:", post);
}

async function updatePostById(id) {
  await blogEntries.updateOne(
    { _id: new ObjectId(id) },

    {
      $set: {
        name: "Lorena",
        lastName: "Alonso",
        nickname: "estrrellita",
        postTitle: "perdi la cuenta",
        postText: "soloosahf,sb,b ,sfhgvajsñ",
        postComments: [{}]
      }
    }
  );

  console.log("Updated post with id:", id);
}

async function updateblogEntriesByFirstName() {
  const { matchedCount } = await blogEntries.updateMany(
    { name: "Juan" },
    { $set: { name: "Peter" } }
  );

  console.log(`Updated ${matchedCount} blogEntries with name "Juan"`);
}

async function deletePostById(id) {
  await blogEntries.deleteOne({ _id: new ObjectId(id) });

  console.log("Deleted post with id:", id);
}

async function deleteblogEntriesByFirstName() {
  const { deletedCount } = await blogEntries.deleteMany({ name: "Jack" });

  console.log(`Deleted ${deletedCount} blogEntries with name "Jack"`);
}

*/

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
  //y luego levana express
  app.listen(3012, () => console.log("Server started in port 3000"));
}

main();
