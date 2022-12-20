const express = require("express");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/shopping-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();

const User = require('./models/user.js');
router.post('/users', async(req, res) => {
    const {nickname, email, password, confirmPassword} = req.body;

    // 1. 패스워드, 패스워드 검증 값이 일치하는가? - clear 
    // 2. email에 해당하는 사용자가 있는가
    // 3. nickname에 해당하는 사용자가 있는가
    // 4. DB에 데이터를 삽입

    if (password !== confirmPassword){
        res.status(400).json({
            errorMessage: "password와 confirmPassword가 일치하지 않습니다."
        });
        return;
    }

    const existUser = await User.findOne({
        $or:[{email: email}, {nickname: nickname}]            // 이 안에 있는 값 중에 하나라도 일치 했을 때 보여준다는 뜻
    });

    if(existUser){
        res.status(400).json({
            errorMessage: "Email이나 Nickname이 이미 사용 중입니다."
        });
        return; 
    }

    const user = new User({nickname, email, password});
    await user.save(); 

    res.status(201).json({}); //post 메서드이기 때문에 정상적으로 패스워드와 이메일과 닉네임이 검증되면 실제로 데이터가 생성, 201번이라는 의미가 데이터를 생성을 했다는 뜻 
}); 


app.use("/api", express.urlencoded({ extended: false }), router); // extended가 true 일 경우 객체 형태로 전달된 데이터 내에서 또다른 중첩된 객체를 허용한다는 의미. false는 허용X 
 // true 쓸 경우 npm qs 라이브러리 설치, false 일경우 node.js에 기본 내장된 queryString 사용, 간단하게 우리는 중첩된 객체를 허용한다 안한다라고 생각하자.(추가 보안기능)

app.use(express.static("assets"));

app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});