const express = require('express');
const app = express();
const port = 1636;
const goodsRouter = require('./routes/goods.js');
const cartsRouter = require('./routes/carts.js');
const connect = require("./schemas");
connect();

app.use(express.json()); // post, put 전달된 body 데이터를 req.body로 사용할 수 있도록 만든 bodyparser

app.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl, ' - ', new Date());
  next();
});

app.use((req, res, next) => {
  console.log('첫번째 미들웨어');
  next();
});

app.use((req, res, next) => {
  console.log('두번째 미들웨어');
  next();
});

app.use((req, res, next) => {
  console.log('세번째 미들웨어');
  next();
});


app.use("/api", [goodsRouter, cartsRouter]); // API가 사용되기 위한 라우터를 등록 

app.get('/', (req, res) => {
    res.send('Hello World!');
  });

    
app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
  });



// app.get("/", (req,res) => {
//     console.log(req.body);

   

//     res. status(500).json({
//         "keykey" : "value 입니다.",
//         "이름입니다." : "이름일까요?"
//     });
// });

// app.get("/", (req,res) => {
//     console.log(req.query);

//     res.send('정상적으로 반환되었습니다.');
// })

// app.get("/:id", (req,res) => {
//     console.log(req.params);

//     res.send(":id URL에 정상적으로 반환되었습니다.");
// })



// app.use("/api", goodsRouter);

