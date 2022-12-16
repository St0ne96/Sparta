const express = require('express');
const app = express();
const port = 1636;
const postsRouter = require("./routes/posts.js");
// DB 연결 모듈 
const connect = require("./schemas/");
// mongodb 연결 
connect();

app.use(express.json());
app.use("/api", [postsRouter]);





// 첫 화면 
app.get('/', (req, res) => {
    res.send('Hello World!');
  });

    
app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
  });

  