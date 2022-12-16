const express = require("express");
const router = express.Router();
const Post = require("../schemas/post");



// 게시글 전체 조회 API 
router.get("/post", async (req,res) => {
    try {
        const posts = await Post.find({});
        res.json({posts})
    } catch (err) {
        console.error(err); 
    }
});


// 게시글 상세 조회 API 
router.get("/post/:id", async (req,res) => {
    const existsposts = await Post.find({Post: req.params.id}); 
    console.log(existsposts)
      
});


// 게시글 작성 
router.post("/post", async (req, res) => {
    const {user, password, title, content} = req.body; 

    const createPosts = await Post.create({user, password, title, content}); 
    res.json({data: createPosts}); 
});


// 게시글 삭제 
router.delete("/post/delete/:id", async(req, res) => {
    try {
        const existsposts = await Post.find({Post: req.params.id});
        console.log(existsposts)
    } catch(err){
        console.error(err);
    } finally{
        await Post.deleteOne({Post: req.params.id});
    }
    res.json({result: "success"});
  });


// 게시글 수정
router.put("/post/update/:id", async(req,res) => {
    try {
        const existsposts = await Post.find({Post: req.params.id});
        console.log(existsposts)
    } finally {
        await Post.updateOne(
            {$set: {user:user}},
            {$set: {title:title}},
            {$set: {content:content}}
          )
    }
    res.status(200).json({success:true});
  })



module.exports = router; 


