const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const url = "mongodb://localhost:27017/BlogDB";

let conn;
let blogEntries;

async function insertOne() {
  await blogEntries.insertOne({
    name: "Jack",
    lastName: "Bauer",
    nickname: "ppppp",
    postTitle: "el primero",
    postText: "lallalalalalallala",
    postComments: [
      { nickname: "pichi", text: "primer comentario", date: "2/01/2020" }
    ]
  });

  console.log("Post inserted");
}

async function insertOneWithId() {
  const { insertedId } = await blogEntries.insertOne({
    name: "Jack",
    lastName: "Bauer",
    nickname: "ppppp",
    postTitle: "el primero",
    postText: "lallalalalalallala",
    postComments: [
      { nickname: "pichi", text: "primer comentario", date: "2/01/2020" }
    ]
  });

  console.log("Post inserted with id:", insertedId);

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

async function main() {
  conn = await MongoClient.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

  console.log("Connected to Mongo");

  blogEntries = conn.db().collection("blogEntries");

  await insertOne();
  const id = await insertOneWithId();
  await insertMany();
  await insertManyWithId();
  //await findPostWithQuery();
  await findPostById(id);
  //await updatePostById(id);
  //await updateblogEntriesByFirstName();
  //await deletePostById(id);
  await deleteblogEntriesByFirstName();

  conn.close();

  console.log("Connection closed");
}

main();
