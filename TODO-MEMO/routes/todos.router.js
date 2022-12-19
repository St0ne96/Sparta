const express = require("express");
const todo = require("../models/todo.js");
const Todo = require("../models/todo.js");

const router = express.Router();

router.get("/", (req,res) => {
    res.send("hi");
}) 

//할일 추가 api 
router.post("/todos", async(req,res) => {
    const {value} = req.body; 
    const maxOrderByUserId = await Todo.findOne().sort("-order").exec();

    const order = maxOrderByUserId ? 
        maxOrderByUserId.order + 1 : // maxOrderByUserId 있을 때 값 +1 , 
        1; // maxOrderByUserId가 없을 때 

    const todo = new Todo({value, order});
    await todo.save(); 

    res.send({todo}); 
})

//할일 전체 조회 api 
router.get("/todos", async(req,res) => {
    const todos = await Todo.find().sort("-order").exec();  // order 앞에 "-" 가 붙을 경우 내림차순으로 정렬 하겠다는 의미 =>   "-order"

    res.send({todos}); 

})


// 할일 순서 수정 api
router.patch("/todos/:todoId", async (req,res) => {
    const {todoId} = req.params; 
    const { order, value, done } = req.body;

    // 1. todoId에 해당하는 할 일이 있는가?
    // 1-1. todoId에 해당하는 할 일이 없으면,  에러를 출력한다. 
    const currentTodo = await Todo.findById(todoId); // findById => 해당하는 _id 값을 찾고 return 해줌  
    if (!currentTodo){
        return res.status(400).json({"errorMessage": "존재하지 않는 할 일 입니다."}); 
    }

    //payload 안에 value, done, order 값 3개가 들어옴, 그래서 이것을 각각 분기 처리해야함
    if (order){
        const targetTodo = await Todo.findOne({order}).exec();
         // 2 -> 1 로 내려감  
        if(targetTodo){ 
            targetTodo.order = currentTodo.order; 
            await targetTodo.save();
        }
     // 1-> 2로 올라감    
        currentTodo.order = order;     
    } else if (value) {
        currentTodo.value = value; 
    } else if (done !== undefined) {
        currentTodo.doneAt = done ? new Date(): null; 
    }
   
    await currentTodo.save(); 
    res.send();
})

// 할일 삭제 api 
router.delete("/todos/:todoId", async (req,res) => {
    const { todoId } = req.params;
  
    const todo = await Todo.findById(todoId).exec();
    await todo.delete();
  
    res.send({});

  });
   


module.exports = router;