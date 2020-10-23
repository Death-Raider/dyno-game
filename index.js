const c = document.getElementById("Mycanvas");
const ctx = c.getContext("2d");
const btn = document.getElementById("jump")
const stop = document.getElementById("stop")
const occ = document.getElementById("occ")
const speed = document.getElementById("speed")
const jumpbtn = document.getElementById("jump")
class World{
  constructor(){
    this.gravity = 4;
    this.objectSpeed = 20;
    this.occur = 40;
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
  jump(t){ // JUMPS and omfg do i wanna die rn cause of this shit
    this.remove();
    let update = (this.jumpStrength*t - this.gravity*t*t/2)//S = ut - (1/2)gt^2
    if(update >= 0){
      this.location[0][1] -= ((this.jumpStrength-this.gravity*t>=0)?1:-1)*update;//checks derivative value.
      if(this.onFloor(this.location) == -1) this.location[0][1] = 210;
    }else this.location[0][1] = 210;
    t = (t!=this.previousTime)?t + 1:t+2
    this.previousTime = t-1;
    this.show();
    return t
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
  let time = 0,timeJump = 0;
  let game = setInterval(()=>{
    timeJump = dyno.jump(timeJump);
    if(timeJump%bullet.occur == 10){bullet.create();}
    bullet.move();
    btn.addEventListener('click',()=>{timeJump = 0});
    if(timeJump == 6) timeJump--;
    jumpbtn.disabled = (world.onFloor(dyno.location) > 0)
    if(bullet.obj.length != 0) if(world.checkCollision(dyno,bullet.obj)) stopping(game);
    if(time%bullet.occur == 15){
      let rand_bullet_addition = Math.floor(Math.random()*20)
      console.log(rand_bullet_addition);
      if( rand_bullet_addition == 10 ){bullet.create();bullet.create();}
      if( rand_bullet_addition == 5 || rand_bullet_addition == 13 || rand_bullet_addition == 4) bullet.create();
      bullet.objectSpeed += 2;
      bullet.occur -= 1
    }
    if(bullet.occur <= 15) stopping(game);
    occ.innerHTML = "Occurence =>"+bullet.occur;
    speed.innerHTML = "speed =>"+bullet.objectSpeed;
    time++
  },60);
  stop.addEventListener('click',()=>{stopping(game)});
}
function stopping(x){clearInterval(x)}
function clear(){
  ctx.beginPath();
  ctx.fillStyle = "#fff8f8";
  ctx.fillRect(0,0,c.width,c.height);
}
