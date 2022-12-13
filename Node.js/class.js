class unit{
        constructor (name, hp) {
            this.name = name ;
            this.hp = hp ;
          
            
        }

        healing(heal){
            if(this.hp < 100 && this.hp > 0){
                this.hp += heal
                return this.hp;
            } else if (this.hp >= 100 ) {
                return "회복 안됨"
            } else { return "게임 오버"}
        }
        
        damaged(deal){
            if(this.hp > 0 ){
                this.hp -= deal
                return this.hp;
            } else if (this.hp <= 0 ) {
                return "딜 안됨"
            }
                     
            
        }
            
    
}

const user = new unit("김범석", 10); 
console.log(user.name);
console.log(user.hp);
console.log(user.healing(90));
console.log(user.healing(90));
console.log(user.damaged(20));
console.log(user.damaged(80));
console.log(user.damaged(20));
console.log(user.healing(20));
