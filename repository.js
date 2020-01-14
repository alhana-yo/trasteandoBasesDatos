// Importo MongoDB y Express
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const url = "mongodb://localhost:27017/BlogDB";

//estas son nuestras colecciones
let blogEntries; // coleccion de entradas del blog
let words; // coleccion de palabras

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
  words = conn.db().collection("words");
  //si yo necesitara acceder a otra colección , podría hacerlo de la misma manera de arriba ¿??¿?
}

async function main() {
  await dbConnect(); //espera a que se conecte la base de datos

  //y luego levanta express
  //   app.listen(3000, () => console.log("Server started in port 3000"));
}

exports.insertBlogEntry = async function(newBlogEntry) {
  //inserto el anuncio nuevo en la colección de la base de datos
  await blogEntries.insertOne(newBlogEntry);
};

exports.listBlogEntries = async function() {
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
  return allBlogEntries;
};

exports.findPost = async function(id) {
  const blogEntry = await blogEntries.findOne({ _id: new ObjectId(id) });
  return blogEntry;
};

exports.deletePost = async function(id) {
  await blogEntries.deleteOne({ _id: new ObjectId(id) });
};

main();
