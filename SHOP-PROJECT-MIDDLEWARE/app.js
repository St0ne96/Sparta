const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require('./models/user.js');
const Goods = require("./models/goods");
const Cart = require("./models/cart");
const authMiddleware = require('./middlewares/auth-middleware.js');

mongoose.connect("mongodb://127.0.0.1:27017/shopping-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();




// 회원가입 API 
const postUsersSchema = Joi.object({
    nickname: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  });

router.post('/users', async(req, res) => {
    try{
        const {nickname, email, password, confirmPassword} = await postUsersSchema.validateAsync(req.body);

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

        const existUser = await User.find({
            $or:[{email: email}, {nickname: nickname}]            // 이 안에 있는 값 중에 하나라도 일치 했을 때 보여준다는 뜻
        });
        if(existUser.length){
            res.status(400).json({
                errorMessage: "Email이나 Nickname이 이미 사용 중입니다."
            });
            return; 
        }

        const user = new User({nickname, email, password});
        await user.save(); 

        res.status(201).json({}); //post 메서드이기 때문에 정상적으로 패스워드와 이메일과 닉네임이 검증되면 실제로 데이터가 생성, 201번이라는 의미가 데이터를 생성을 했다는 뜻 
    } catch(err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다."
        });
    }    
}); 




//로그인 기능 
// GET 메서드는 URL에 데이터를 표현하지만 POST는 그렇지 않아서 그나마 보안에 괜춘... 
// REST API 관점에서 보면 데이터를 조회를 해서 생성을 한다라는 의미를 가지고 있어 post를 쓰고 있다 
const postAuthSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
router.post("/auth", async (req, res) => {
    try{
        const { email, password } = await postAuthSchema.validateAsync(req.body);

        const user = await User.findOne({ email, password }).exec(); //이메일, 비밀번호를 기준으로 찾음 
      
        // 1. 사용자가 존재하지 않거나,
        // 2. 입력받은 password와 사용자의 password가 다를 때 에러메시지가 발생해야한다. 
      
        // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
        if (!user || password !== user.password) {
          res.status(400).send({
            errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
          });
          return; //밑에 코드가 실행되지 않게 하기 위해 return 
        }

        const token = jwt.sign({userId:user.userId}, "sparta-secret-key");
        res.status(200).json({"token": token});
    } catch(err){
        console.log(err); 
        res.status(400).send({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다."
        });
    }
});


router.get("/users/me", authMiddleware, async (req, res) => {
    res.json({user: res.locals.user});
});

app.use("/api", express.urlencoded({ extended: false }), router); // extended가 true 일 경우 객체 형태로 전달된 데이터 내에서 또다른 중첩된 객체를 허용한다는 의미. false는 허용X 
 // true 쓸 경우 npm qs 라이브러리 설치, false 일경우 node.js에 기본 내장된 queryString 사용, 간단하게 우리는 중첩된 객체를 허용한다 안한다라고 생각하자.(추가 보안기능)

app.use(express.static("assets"));

// 장바구니 목록 불러오기 API 
router.get("/goods/cart", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
  
    const cart = await Cart.find({userId}).exec();
  
    const goodsIds = cart.map((c) => c.goodsId);
  
    // 루프 줄이기 위해 Mapping 가능한 객체로 만든것
    const goodsKeyById = await Goods.find({_id: { $in: goodsIds }}).exec().then(
        (goods) => goods.reduce((prev, g) => ({
            ...prev,[g.goodsId]: g
          }),{})
        );
  
    res.send({
      cart: cart.map((c) => ({
        quantity: c.quantity,
        goods: goodsKeyById[c.goodsId],
      })),
    });
  });
  
  /**
   * 장바구니에 상품 담기.
   * 장바구니에 상품이 이미 담겨있으면 갯수만 수정한다.
   */
  router.put("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { goodsId } = req.params;
    const { quantity } = req.body;
  
    const existsCart = await Cart.findOne({
      userId,
      goodsId,
    }).exec();
  
    if (existsCart) {
      existsCart.quantity = quantity;
      await existsCart.save();
    } else {
      const cart = new Cart({
        userId,
        goodsId,
        quantity,
      });
      await cart.save();
    }
  
    // NOTE: 성공했을때 응답 값을 클라이언트가 사용하지 않는다.
    res.send({});
  });
  
  /**
   * 장바구니 항목 삭제
   */
  router.delete("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { goodsId } = req.params;
  
    const existsCart = await Cart.findOne({
      userId,
      goodsId,
    }).exec();
  
    // 있든 말든 신경 안쓴다. 그냥 있으면 지운다.
    if (existsCart) {
      existsCart.delete();
    }
  
    // NOTE: 성공했을때 딱히 정해진 응답 값이 없다.
    res.send({});
  });
  
  /**
   * 모든 상품 가져오기
   * 상품도 몇개 없는 우리에겐 페이지네이션은 사치다.
   * @example
   * /api/goods
   * /api/goods?category=drink
   * /api/goods?category=drink2
   */
  router.get("/goods", authMiddleware, async (req, res) => {
    const { category } = req.query;
    const goods = await Goods.find(category ? { category } : undefined)
      .sort("-date")
      .exec();
  
    res.send({ goods });
  });
  
  /**
   * 상품 하나만 가져오기
   */
  router.get("/goods/:goodsId", authMiddleware, async (req, res) => {
    const { goodsId } = req.params;
    const goods = await Goods.findById(goodsId).exec();
  
    if (!goods) {
      res.status(404).send({});
    } else {
      res.send({ goods });
    }
  });




app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});

