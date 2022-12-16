const express = require("express");
const router = express.Router();
const Comment = require("../schemas/comment");


router.post('/comment', async (req,res) => {
    try {
        const comment = await Comment.create({
            author: req.body.id, 
            comment: req.body.comment,
        });
        console.log(comment);

        const result = await Comment.populate(comment, {path: 'author'});
        res.status(201).json(result);
    } catch(err) {
        console.error(err);
    }
});

