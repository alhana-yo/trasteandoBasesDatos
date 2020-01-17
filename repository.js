// Importo MongoDB y Express
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/BlogDB";
const defaultBadWords = require("./defBadWords");
//estas son nuestras colecciones
let blogEntries; // coleccion de entradas del blog

//Definimos el esquema para las badwords (están mongoose)
const Schema = mongoose.Schema;

const BadWordSchema = new Schema({
  badword: String,
  level: Number
}, {
  versionKey: false // set to false then it wont create in mongodb
});

const UserSchema = new Schema({
  author: String,
  nickname: String,
  role: String
}, {
  versionKey: false
})

const BadWord = mongoose.model("BadWord", BadWordSchema);
const User = mongoose.model('User', UserSchema);

async function dbConnect() {
  //creo la conexión a la base de datos con Mongo
  let conn = await MongoClient.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  //creo la conexión a la base de datos con Mongoose
  await mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
  });

  console.log("Connected to Mongo");
  blogEntries = conn.db().collection("blogEntries");
}

/**
 * This function checks if de data base is empty. If it is, it put some
 * default dates into the database
 * @param {*} collection
 * @param {*} defaultContent
 */
async function isEmpty(collection, defaultContent) {
  const bdContent = await collection.find();
  if (bdContent.length == 0) {
    //si no está vacia, la relleno con las palabras por defecto
    await collection.insertMany(defaultContent);
    return true;
  } else {
    return false;
  }
}

async function main() {
  await dbConnect(); //espera a que se conecte la base de datos
  await isEmpty(BadWord, defaultBadWords);
}

/***************** BLOGENTRIES COLLECTION *********************/
exports.insertBlogEntry = async function (newBlogEntry) {
  //inserto el anuncio nuevo en la colección de la base de datos
  await blogEntries.insertOne(newBlogEntry);
};

exports.listBlogEntries = async function () {
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

exports.findPost = async function (id) {
  const blogEntry = await blogEntries.findOne({ _id: new ObjectId(id) });
  return blogEntry;
};

exports.deletePost = async function (id) {
  await blogEntries.deleteOne({ _id: new ObjectId(id) });
};

exports.updatePost = async function (id, newBlogEntry) {
  await blogEntries.updateOne(
    { _id: new ObjectId(id) },
    { $set: newBlogEntry }
  );
};

exports.addNewComment = async function (id, blogEntry, newComment) {
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
};

exports.updateComment = async function (
  id,
  commentForUpdatingId,
  newCommentInfo
) {
  const query = {
    _id: new ObjectId(id),
    "postComments.commentId": new ObjectId(commentForUpdatingId)
  };

  const newValues = {
    $set: { "postComments.$": newCommentInfo }
  };

  const commentForUpdating = await blogEntries.updateOne(query, newValues);
  return commentForUpdating;
};

exports.deleteComment = async function (id, commentForDeletingId) {
  const query = {
    _id: new ObjectId(id),
    "postComments.commentId": new ObjectId(commentForDeletingId)
  };

  const itemToDelete = {
    $pull: {
      postComments: { commentId: new ObjectId(commentForDeletingId) }
    }
  };

  const commentForDeleting = await blogEntries.updateOne(query, itemToDelete);
  return commentForDeleting;
};
/***************** END OF BLOGENTRIES COLLECTION *********************/

/***************** WORDS COLLECTION *********************/

exports.findAllwords = async function () {
  const badwords = await BadWord.find();
  return badwords;
};

exports.findOneWord = async function (id) {
  const badword = await BadWord.findById(id);
  return badword;
};

exports.postOneWord = async function (word) {
  const badword = new BadWord(word);
  await badword.save();
  return badword;
};

exports.updateOneWord = async function (id, updatedWord) {
  await BadWord.findByIdAndUpdate(id, updatedWord);
};

exports.deleteOneWord = async function (id) {
  await BadWord.findByIdAndRemove(id);
};

/***************** END OF WORDS COLLECTION **************/

/***************** USERS COLLECTION *********************/

exports.findAllusers = async function () {
  const users = await User.find();
  return users;
};

exports.findOneUser = async function (id) {
  const user = await User.findById(id);
  return user;
};

exports.postOneUser = async function (user) {
  const newUser = new User(user);
  await newUser.save();
  return newUser;
};

/***************** END OF USERS COLLECTION **************/

main();
