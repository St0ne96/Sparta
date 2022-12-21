// 모델
// jwt 
const  jwt = require("jsonwebtoken");
const User = require("../models/user.js");

module.exports = async(req, res, next) => {
    const {authorization} = req.headers; 
    console.log(authorization);
    const[authType, authToken] = authorization.split(" ");
    //authType : Bearer
    // authToken : 실제 jwt 값 

    console.log ([authType, authToken]);

    if (authType !== "Bearer" || !authToken){
        res.status(400).json({
            errorMessage: "로그인 후 사용 가능합니다."
        });
        return; 
    }

    try {      
    // 복호화 및 검증
    // 여기서 spart-secret-key가 다를 시 서버 종료가 됨으로 에러를 나타내야함 의도적으로. 그래서  try catch 사용 / 에러 헨들링 
        const {userId} = jwt.verify(authToken, "sparta-secret-key");
        const user = await User.findById(userId);
        res.locals.user = user;
        next(); 
    }catch(error){
        res.status(400).json({
            errorMessage: "로그인 후 사용 가능합니다."
        })
        return ; 
    }
  
 
}