const express = require("express");
const router = express.Router();

// /routes/goods.js
const goods = [
    {
      goodsId: 4,
      name: "상품 4",
      thumbnailUrl:
        "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
      category: "drink",
      price: 0.1,
    },
    {
      goodsId: 3,
      name: "상품 3",
      thumbnailUrl:
        "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
      category: "drink",
      price: 2.2,
    },
    {
      goodsId: 2,
      name: "상품 2",
      thumbnailUrl:
        "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
      category: "drink",
      price: 0.11,
    },
    {
      goodsId: 1,
      name: "상품 1",
      thumbnailUrl:
        "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
      category: "drink",
      price: 6.2,
    },
  ];

router.get("/goods", (req,res) => {
    res.status(200).json({goods})
});

router.get("/goods/:goodsId", (req,res) => {
    const {goodsId} = req.params; 
    
    // let result = null;
    // for(const good of goods){
    //     if( Number(goodsId) === good.goodsId){
    //         result = good;
    //     }
    // }


    const [result] = goods.filter((good) => Number(goodsId) === good.goodsId)

    res.status(200).json({ detail: result });
});

module.exports = router; 