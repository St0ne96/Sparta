const express = require("express");

const db = require("./models/index.js"); 
const todosRouter = require("./routes/todos.router.js");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const SECRET_KEY = `sparta`;

const app = express();

app.use(express.json());
app.use("/api", express.json(), todosRouter);
// assets 경로 안에 아무런 가공없이 파일을 전달해주는 미들웨어  
app.use(express.static("./assets"));
app.use(cookieParser());

// set cookie 예제 
// app.get("/set-cookie", (req, res) => {
//   const expire = new Date();
//   expire.setMinutes(expire.getMinutes() + 60); // 만료 시간을 60분으로 설정합니다.

//   res.writeHead(200, {
//     'Set-Cookie': `name=sparta; Expires=${expire.toGMTString()}; HttpOnly; Path=/`,
//   });
//   return res.status(200).end();
// });


// get cookie 예제
// app.get("/get-cookie", (req, res) => {
//   const cookie = req.cookies;
//   console.log(cookie); // { name: 'sparta' }
//   return res.status(200).json({ cookie });
// });

// set-session 예제 
// 쿠키 정보를 서버에 저장 
let session = {}; // session 객체 생성 
app.get('/set-session', function (req, res, next) {
  const name = 'sparta';
  const uniqueInt = Date.now();
  session[uniqueInt] = { name };

  res.cookie('sessionKey', uniqueInt);
  return res.status(200).end();
});

// get session 예제 
// sessionkey를 이용해서 session에 저장된 데이터를 불러옴 
app.get('/get-session', function (req, res, next) {
  const { sessionKey } = req.cookies;
  const name = session[sessionKey];
  return res.status(200).json({ name });
});

// jwt 쿠키 api 개발 예제 
let tokenObject = {}; // refreshtoken을 저장할 Object 생성 

app.post('/set-key', (req, res) => {
  const { key } = req.body; 
  const token = jwt.sign({ key }, "sparta");
  res.cookie('token',token);
  
  return res.status(200).send({"message": "Token이 정상적으로 발급되었습니다."});
});

app.get('/get-key', (req,res) => {
  const { token } = req.cookies;
  const { key } = jwt.decode(token);
  return res.status(200).json({ key });
});



app.listen(8080, () => {
  console.log("서버가 켜졌어요!");
});