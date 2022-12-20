const jwt = require("jsonwebtoken");

const token = jwt.sign(
    { myPayloadData: 1234 }, //jwt를 이용해서 payload 설정하는 부분 
    "mysecretkey",  // jwt를 이용해서 암호화를 하기 위한 비밀키 
    { expiresIn: new Date().getMinutes() + 1 } // 특정시간 뒤에 만료가 되는 키를 만들 수 있다
    );
// console.log(token);

const decodeToken = jwt.decode(token); // jwt의 payload를 확인하기 위해서 사용함 
// console.log(decodeToken);


// 1. 암호화를 할 때 사용한 비밀키가 일치하는지 검증 
// 2. 해당하는 jwt가 만료되었는지 검증 
const verifyToken = jwt.verify(token, "mysecretkey"); // jwt 검증을 하기위해 사용 
console.log(verifyToken);

