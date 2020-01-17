const express = require('express');
const entryRouter = express.Router();

const repository = require("../repository.js");
const toResponse = require("../toResponse.js");

entryRouter.post("/", async (req, res) => {
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
entryRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;
    const blogEntry = await repository.findPost(id);
    if (!blogEntry) {
        res.sendStatus(404);
    } else {
        await repository.deletePost(id);
        res.json(toResponse(blogEntry));
    }
});

// editar un post en concreto
entryRouter.put("/:id", async (req, res) => {
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
entryRouter.post("/:id/comments", async (req, res) => {
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
entryRouter.put("/:id/comments/:commentId", async (req, res) => {
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
            blogEntry = await repository.findPost(id);
            res.json(toResponse(blogEntry));
            console.log("todo ha ido ok");
        }
    }
});

//borra el comentario de un post, según su id
entryRouter.delete("/:id/comments/:commentId", async (req, res) => {
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

module.exports = entryRouter;