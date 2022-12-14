const express = require('express');
const app = express();
const port = 1636;
const goodsRouter = require('./routes/goods.js');


app.use(express.json());

app.get("/", (req,res) => {
    console.log(req.body);

   

    res. status(500).json({
        "keykey" : "value 입니다.",
        "이름입니다." : "이름일까요?"
    });
});

app.get("/", (req,res) => {
    console.log(req.query);

    res.send('정상적으로 반환되었습니다.');
})

// app.get("/:id", (req,res) => {
//     console.log(req.params);

//     res.send(":id URL에 정상적으로 반환되었습니다.");
// })

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.use("/api", goodsRouter);

  
app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});