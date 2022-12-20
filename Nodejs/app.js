const express = require("express"); 
const cookieParser = require("cookie-parser"); 
const app = express();

app.use(cookieParser());

app.get("/", (req,res) => {
    res.send("메인 페이지 준비완료");
}) 

let session = {}; 
app.get('/set', function(req, res, next) {
    const name = 'sparta';
    const uniqueInt = Date.now();
    session[uniqueInt] = { name };

    res.cookie('sessionKey',uniqueInt);
    return res.status(200).end();
});

app.get('/get', function(req, res, next) {
    const {sessionKey} = req.cookies; 
    const name = session[sessionKey]; 
    return res.status(200).json({ name }); 
});

app.listen(5001, () => {
    console.log("시스템 가동 준비완료!!");
});

