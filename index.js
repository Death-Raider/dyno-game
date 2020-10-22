var c = document.getElementById("Mycanvas");
var ctx = c.getContext("2d");
var btn = document.getElementById("jump")
var stop = document.getElementById("stop")
clear()
class World{
  constructor(){
    this.gravity = 4;
  }
  floor(){
    ctx.beginPath();
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(0,250,c.width,c.height)
  }
  onFloor(location){//block 1 vs floor
    if(location[0][1] + location[1][1] < 250) return +1;
    else if(location[0][1] + location[1][1] == 250) return 0;
    else return -1
  }
}
class Dyno extends World {
  constructor() {
    super()
    this.jumpStrength = 18;
    this.location = [[60,210],[20,40]]; //[x,y],[width,height]
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
  jump(time){
    this.remove();
    let update = (this.jumpStrength*time - this.gravity*time*time/2)//S = ut - (1/2)gt^2
    console.log(update);
    if(update >= 0){
      this.location[0][1] -= ((this.jumpStrength-this.gravity*time>=0)?1:-1)*update;//checks derivative value.
      if(this.onFloor(this.location) == -1){
        this.location[0][1] = 210
      }
    }else{
      this.location[0][1] = 210
    }
    this.show();
  }
}
class Obstruction extends World{
  constructor(){
    super()
    this.obj1 = [[c.width,220],[20,30]]
    this.obj2 = [[c.width,220],[20,30]]
    this.obj3 = [[c.width,220],[20,30]]
  }
  move(obj){
    this.remove(obj);
    obj[0][0] -= this.objectSpeed;
    if(obj[0][0] <= 0) obj[0][0] = c.width
    this.show(obj);
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
world = new World()
dyno = new Dyno()
obs = new Obstruction()
world.floor()
dyno.show()
btn.addEventListener('click',reset);
stop.addEventListener('click',stopping);
let time = 0
game = setInterval(()=>{
  obs.move(obs.obj1);
  dyno.jump(time)
  time++
},100)
function reset(){
  clearInterval(game)
  let time = 0
  game = setInterval(()=>{
    obs.move(obs.obj1);
    dyno.jump(time)
    time++
  },100)
}
function stopping(){clearInterval(game)}
function clear(){
  ctx.beginPath();
  ctx.fillStyle = "#fff8f8";
  ctx.fillRect(0,0,c.width,c.height);
}
