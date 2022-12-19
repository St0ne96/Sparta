const express = require("express");

const db = require("./models/index.js"); 
const todosRouter = require("./routes/todos.router.js");

const app = express();

app.use("/api", express.json(), todosRouter);
// assets 경로 안에 아무런 가공없이 파일을 전달해주는 미들웨어  
app.use(express.static("./assets"));

app.listen(8080, () => {
  console.log("서버가 켜졌어요!");
});