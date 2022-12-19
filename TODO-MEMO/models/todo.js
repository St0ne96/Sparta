const mongoose = require("mongoose"); 

const TodoSchema = new mongoose.Schema({
    value: String, // 할일이 어떤 것인지 확인하는 컬럼 
    doneAt: Date, // 할일이 언제 완료되었는지, 
    order: Number, // 몇번째 할일인지 
}); 


// 데이터를 조회할 때 자동으로 생성된든 가상의 컬럼 
TodoSchema.virtual("todoId").get(function(){
    return this._id.toHexString();
});

// virtual를 Mongodb에는 todoID 값이 나오지 않지만 express() 라이브러리를 통해서 조회를 했을 때 JSON 형식으로 가상의 todoId 값이 보이게 함. 
TodoSchema.set("toJSON", { virtuals: true}); 

module.exports = mongoose.model("Todo", TodoSchema);