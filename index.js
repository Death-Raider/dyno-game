const c = document.getElementById("Mycanvas");
const ctx = c.getContext("2d");
const btn = document.getElementById("jump")
const stop = document.getElementById("stop")
class World{
  constructor(){
    this.gravity = 4;
    this.objectSpeed = 10;
  }
  floor(){ //creates floor
    ctx.beginPath();
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(0,250,c.width,c.height)
  }
  onFloor(location){//checks collision with floor
    if(location[0][1] + location[1][1] < 250) return +1;
    else if(location[0][1] + location[1][1] == 250) return 0;
    else return -1;
  }
  checkCollision(x,y,x_condition_1=false,x_condition_2=false,y_condition_1=false,y_condition_2=false){// y hitting x
    //calculating x coordinates
    x_condition_1 = ((x.location[0][0]+x.location[1][0])>=y[0][0][0])&&(y[0][0][0]>=x.location[0][0]);
    x_condition_2 = ((x.location[0][0]+x.location[1][0])>=(y[0][0][0]+y[0][1][0]))&&((y[0][0][0]+y[0][1][0])>=x.location[0][0]);
    if(x_condition_1 || x_condition_2){
      //calculating y coordinates
      y_condition_1 = ((x.location[0][1]+x.location[1][1])>=y[0][0][1])&&(y[0][0][1]>=x.location[0][1]);
      y_condition_2 = ((x.location[0][1]+x.location[1][1])>=(y[0][0][1]+y[0][1][1]))&&((y[0][0][1]+y[0][1][1])>=x.location[0][1]);
      if(y_condition_1 || y_condition_2){return true} else {return false}
    }else{return false}
  }
}
class Dyno extends World {
  constructor() {
    super()
    this.jumpStrength = 18;
    this.location = [[60,210],[20,40]]; //[x,y],[width,height]
    this.previousTime = -1;
  }
  show(){
    ctx.beginPath();
    ctx.fillStyle = "Black";
    ctx.fillRect(this.location[0][0],this.location[0][1],this.location[1][0],this.location[1][1]);
  }
  remove(){
    ctx.beginPath();
    ctx.fillStyle = "#fff8f8";
    ctx.fillRect(this.location[0][0],this.location[0][1]-1,this.location[1][0]+5,this.location[1][1]+1);//extra added just in case
  }
  jump(time){ // JUMPS and omfg do i wanna die rn cause of this shit
    this.remove();
    let update = (this.jumpStrength*time - this.gravity*time*time/2)//S = ut - (1/2)gt^2
    if(update >= 0){
      this.location[0][1] -= ((this.jumpStrength-this.gravity*time>=0)?1:-1)*update;//checks derivative value.
      if(this.onFloor(this.location) == -1) this.location[0][1] = 210;
    }else this.location[0][1] = 210;
    time = (time!=this.previousTime)?time + 1:time+2
    this.previousTime = time-1;
    this.show();
    return time
  }
}
class Bullet extends World{
  constructor(){
    super()
    this.obj = []
  }
  create(){this.obj.push([[c.width,220],[15,10]])} // addes a bullet
  move(){ // moves all bullets on screen
    for(let i = 0; i < this.obj.length; i++){
      this.remove(this.obj[i]);
      this.obj[i][0][0] -= this.objectSpeed;
      if(this.obj[i][0][0] <= 0) this.obj.splice(i,1)//deletes bullet if it hits the wall
      this.show(this.obj[i]);
    }
  }
  show(x){
    ctx.beginPath();
    ctx.fillStyle = "Black";
    ctx.fillRect(x[0][0],x[0][1],x[1][0],x[1][1]);
  }
  remove(x){
    ctx.beginPath();
    ctx.fillStyle = "#fff8f8";
    ctx.fillRect(x[0][0],x[0][1],x[1][0]+5,x[1][1]);
  }
}

clear()
let world = new World()
let dyno = new Dyno()
let bullet = new Bullet()
world.floor()
dyno.show()

redo()
function redo(){
  let time = 0;
  let game = setInterval(()=>{
    time = dyno.jump(time);
    if(time%50 == 20)bullet.create();
    bullet.move();
    btn.addEventListener('click',()=>{time = 0});
    if(time == 6) time--;
    if(bullet.obj.length != 0){
      if(world.checkCollision(dyno,bullet.obj)) stopping(game);
    }
  },60);
  stop.addEventListener('click',()=>{stopping(game)});
}
function stopping(x){clearInterval(x)}
function clear(){
  ctx.beginPath();
  ctx.fillStyle = "#fff8f8";
  ctx.fillRect(0,0,c.width,c.height);
}
