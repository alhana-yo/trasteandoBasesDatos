// let blogEntries;

// exports.insertBlogEntry = async function (newBlogEntry) {
//     //inserto el anuncio nuevo en la colección de la base de datos
//     await blogEntries.insertOne(newBlogEntry);
// };

// exports.listBlogEntries = async function () {
//     const allBlogEntries = await blogEntries
//         .find(
//             {},
//             {
//                 projection: {
//                     postComments: 0
//                 }
//             }
//         )
//         .toArray();
//     return allBlogEntries;
// };

// exports.findPost = async function (id) {
//     const blogEntry = await blogEntries.findOne({ _id: new ObjectId(id) });
//     return blogEntry;
// };

// exports.deletePost = async function (id) {
//     await blogEntries.deleteOne({ _id: new ObjectId(id) });
// };

// exports.updatePost = async function (id, newBlogEntry) {
//     await blogEntries.updateOne(
//         { _id: new ObjectId(id) },
//         { $set: newBlogEntry }
//     );
// };

// exports.addNewComment = async function (id, blogEntry, newComment) {
//     //Create object with updated fields
//     // const newBlogEntry = {
//     //   postComments: {
//     //     ...blogEntry.postComments,
//     //     newComment
//     //   }
//     // };

//     //Agregamos una id al comentario
//     const myCommentId = new ObjectId();
//     newComment.commentId = myCommentId;
//     //Y ponemos la fecha en la que se creó
//     newComment.date = myCommentId.getTimestamp();
//     blogEntry.postComments.push(newComment);
//     //Update resource
//     await blogEntries.updateOne(
//         { _id: new ObjectId(id) },
//         { $set: blogEntry }
//         // { $set: newblogEntry }
//     );
// };

// exports.updateComment = async function (
//     id,
//     commentForUpdatingId,
//     newCommentInfo
// ) {
//     const query = {
//         _id: new ObjectId(id),
//         "postComments.commentId": new ObjectId(commentForUpdatingId)
//     };

//     const newValues = {
//         $set: { "postComments.$": newCommentInfo }
//     };

//     const commentForUpdating = await blogEntries.updateOne(query, newValues);
//     return commentForUpdating;
// };

// exports.deleteComment = async function (id, commentForDeletingId) {
//     const query = {
//         _id: new ObjectId(id),
//         "postComments.commentId": new ObjectId(commentForDeletingId)
//     };

//     const itemToDelete = {
//         $pull: {
//             postComments: { commentId: new ObjectId(commentForDeletingId) }
//         }
//     };

//     const commentForDeleting = await blogEntries.updateOne(query, itemToDelete);
//     return commentForDeleting;
// };