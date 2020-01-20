// Importo MongoDB y Express
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const mongoose = require("mongoose");
// var bcrypt = require('bcrypt');

const url = "mongodb://localhost:27017/BlogDB";
const defaultBadWords = require("./defBadWords");

const User = require('./models/users.js');
const BadWord = require('./models/badwords.js');

// require('./repositories/badwords.js');

//Mongo collections
let blogEntries; // coleccion de entradas del blog

//Sacar a otro módulo
// async function createSampleUsers() {
//   await addUser('user1', 'pass1', 'role1');
//   await addUser('user2', 'pass2', 'role2');
//   await addUser('user3', 'pass3', 'role3');
// }

// async function addUser(username, password, role) {
//   let passwordHash = await bcrypt.hash(password, bcrypt.genSaltSync(8), null);

//   let user = await User.findOne({ username }).exec();

//   if (!user) {
//     user = new User({ username, passwordHash, role });
//   } else {
//     user.passwordHash = passwordHash;
//   }

//   await user.save();
// }

exports.init = async function () {

  // await mongoose.connect(url, {
  //     useUnifiedTopology: true,
  //     useNewUrlParser: true,
  //     useFindAndModify: false
  // });

  // console.log("Connected to Mongo");

  // createSampleUsers();
}

// exports.find = async function (username) {
//   return await User.findOne({ username }).exec();
// }

// exports.verifyPassword = async function (user, password) {
//   return await bcrypt.compare(password, user.passwordHash);
// }


async function dbConnect() {
  //Conexión a la base de datos con Mongo
  let conn = await MongoClient.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

  //Conexión a la base de datos con Mongoose
  await mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
  });

  console.log("Connected to Mongo");

  // createSampleUsers();

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

main();
