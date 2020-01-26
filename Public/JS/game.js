const canvas = document.getElementById("canvas")
const ctx =  canvas.getContext("2d");
var interval = 100;
canvas.width = 600;
canvas.height = 400;
var press = "";
var action = 0;
var points = 0;
var apm = 0;
//38:25
//950
canvas.style.backgroundColor="#93bbec";

const gameclk = 16.66667;
var sprites = [];

var game ={
    sprites:[],
    character:{},
    tiles:[],
    enemies:[],
    scrollspeed:0,
    cscrollspeed:0,
    sound:true,
    pause:false,
    gravity:9.8,
    shellTimer:0,
    bulletTimer:0,
    level:0
}

const mario = new Mario();

    
function Shell() {
    this.position = {x:0,y:0};
    this.velocity = {x:0,y:0};
    this.acceleration = {x:0,y:0};
    this.gravity = 1;
    this.width = 16;
    this.height = 15;
    this.scale = 16/16;
    this.count = 0;
    this.interval = 100;
    this.state = 0;
    this.frame = 0;
    this.collide = false;
    this.ready = false;
    this.SS = "Public/Assets/koopaSS.png"
    this.run = [
        {x:10,y:37},
        {x:10,y:37+30},
        {x:10,y:37+30+30},
        {x:10,y:37+30+30+30},
        //{x:10,y:37+30},
        //{x:10,y:37+30+30},
    ],
    this.anime = [this.run];
    this.simulate = simulateSprite;
    this.render = render;
}

function Bullet(){
    this.position = {x:0,y:0};
    this.velocity = {x:0,y:0};
    this.acceleration = {x:0,y:0};
    this.gravity = 0;
    this.width = 105;
    this.height = 67;
    this.scale =32/105;
    this.count = 0;
    this.interval = 75;
    this.state = 0;
    this.frame = 0;
    this.SS =  "Public/Assets/bulletBillSS.png";
    this.collide = false;
    this.ready = false;
    this.run = [
        {x:2,y:903},
        {x:2+107,y:902},
        {x:2+107+107,y:902},
        {x:2+107+107+107,y:902},
        {x:2+107+107+107+107,y:902},
        {x:2+107+107+107+107+107,y:902},
        {x:2+107+107+107+107+107+107,y:902},
        {x:2+107+107+107+107+107+107+107,y:902},
        {x:2,y:902+72},
        {x:2+107,y:902+72},
        {x:2+107+107,y:902+72},
        {x:2+107+107+107,y:902+72},
        {x:2+107+107+107+107,y:902+72},
        {x:2+107+107+107+107+107,y:902+72},
        {x:2+107+107+107+107+107+107,y:902+72},
        {x:2+107+107+107+107+107+107+107,y:903+72}
    ],
    this.anime = [this.run];
    this.simulate = simulateSprite;
    this.render = render;
}

function Tile(image,position,delta){
    this.image = image;
    this.velocity = {x:0,y:0}
    this.position = position;
    this.anime = [[delta]]
    this.state = 0;
    this.frame = 0;
    this.width = 64;
    this.height = 64;
    this.scale = 16/64;
    this.simulate = simulateTile;
    this.render = render;
}

function Mario(){
    this.position={x:0,y:0};
    this.velocity={x:0,y:0};
    this.acceleration={x:0,y:0};
    this.gravity=0.5;
    this.width=16;
    this.height=27;
    this.scale=1;
    this.frame=0;
    this.count=0;
    this.state=1;
    this.collide=false;
    this.ratio=()=>{
        return mario.height/mario.width
    };
    this.SS="Public/Assets/marioSS2.gif";
    this.stand=[//{x:120,y:6}
        {x:5+20+21+22+23+19+18+21+19+18,y:34},//2
    ];
    this.run=[
        {x:5+20+21+22+23+19+18+21,y:34},//0
        {x:5+20+21+22+23+19+18+21+19,y:34},//1
        {x:5+20+21+22+23+19+18+21+19+18,y:34},//2
        {x:5+20+21+22+23+19+18+21+19+18+23,y:34},//3
        //{x:5+20+21+22+23+19+18+21+19+18+23+22,y:34},//4
        //{x:5+20+21+22+23+19+18+21+19+18+23+22+21,y:34},//5
        //{x:5+20+21+22+23+19+18+21+19+18+23+22+21+20,y:34},//6
        {x:5+20+21+22+23+19+18+21+19,y:34},//1
        {x:5+20+21+22+23+19+18+21+19+18,y:34},//2
    ];
    this.jump=[{x:27+19+21+21+22+18+21+18+22,y:64}];
    this.interval= 100;
    this.simulate=simulateSprite;
    this.render=render;
}

const tileset = {
    width:64,
    height:64,
    scale:1,
    tile:[],
    key:{
        box:[0,5,10,15,20,25],
        coin:[1,6,11,16,21,26],
        thick:[2,8],
        brick:3,
        spring:[4,9],
        stone:[7,12,13,14,17,18,19,22,23,24,27,28,29,32,33,34]
            // 0,1 ,2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,14,15
    },
    SS:"Public/Assets/marioTileset.png",
    getTile:getTile
}

function getTile(key,ind){

    for(prop in this.key)
        if(prop == key)
            if(typeof ind != "undefined")
                return this.key[prop][ind]
            else
                return this.key[prop]

    return -1;
}


function getStone(type){

    switch(type){
        case "LTLDBR":
            return 0; 
        case "LTL":
            return 1;
        case "LT":
            return 4;        
        case "LTDR":
            return 7;
        case "LTLDR":
            return 10;
        case "LTLDB":
            return 13;
        case "LL":
            return 2;
        case "N":
            return 5;
        case "DR":
            return 8;
        case "LLDR":
            return 11;
        case "LTDB":
            return 14;
        case "LLDB":
            return 3;
        case "DB":
            return 6;
        case "DRB":
            return 9;
        case "LLDBR":
            return 12;
        case "LTDBR":
            return 15;
    }
    return -1;
}

function render(ctx){
    //this.simulate();

    ctx.drawImage(this.image,this.anime[this.state][this.frame].x,this.anime[this.state][this.frame].y,this.width,this.height,this.position.x,this.position.y,this.width*this.scale,this.height*this.scale);
    
    if(this === mario)
        ctx.strokeStyle="#FFFFFF"
    else
        ctx.strokeStyle="#00FF00"
    if(!(this instanceof Tile))
    ctx.strokeRect(this.position.x,this.position.y,this.width*this.scale,this.height*this.scale)
    //ctx.drawImage(this.SS,this.anime[this.state][this.frame].x,this.anime[this.state][this.frame].y,this.width,this.height,this.position.x,this.position.y,this.width*this.scale,this.height*this.scale)
}


function createShell(x,y,velx,vely,accx,accy){
    var img = new Image();
    var s = new Shell();
    img.src = s.SS;
    s.image = img;
    s.position = {x:x,y:y}
    s.velocity = {x:velx,y:vely}
    s.acceleration = {x:accx,y:accy}
    return s;
}



function createBullet(x,y,velx,vely,accx,accy){
    var b = new Bullet();
    var img = new Image();
    img.src = b.SS;
    b.image = img;
    b.position = {x:x,y:y}
    b.velocity = {x:velx,y:vely}
    b.acceleration = {x:accx,y:accy}
    return b;
}


function simulateSprite(){

    if(game.paused || !this.ready)
        return;


    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y + this.gravity;

    if(this.position.y < 300 - (this.height*this.scale))
        this.velocity.y +=this.gravity;


    if(this !== mario)
        this.position.x += this.velocity.x + game.cscrollspeed;
    else
        this.position.x += this.velocity.x;
        
        this.position.y += this.velocity.y;

    if(this.position.y >= 300 - (this.height*this.scale)){
        this.position.y = 300 - (this.height*this.scale);
        this.velocity.y = 0;
    }

    //Temporary
    if(this === mario){
        mario.interval = 100* (1+game.cscrollspeed/10);
        //console.log(mario.interval)
        if(this.velocity.y < 0)
            this.state = 2;
        else if(game.cscrollspeed < 0)
            this.state = 1;
        else
            this.state = 0;

    }

    if(this.position.y>=300){
        this.position.y=300-( this.height* this.scale);
    }
    if(this.count>this.interval){
        this.frame++;
        this.count = 0;
    }
    else
        this.count+= gameclk;
    this.frame = this.frame%this.anime[this.state].length;
}

function simulateTile(){

    if(game.paused)
        return;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if(this.position.x<=-16)
    this.position.x+=623;
}

var clk = window.setInterval(update,gameclk);

function update(){
    //game.cscrollspeed = -game.scrollspeed * 5;

    if(game.pause)
        return;

    for(var i = 0; i < game.tiles.length; i++){
        game.tiles[i].velocity.x= game.cscrollspeed;
    }    
    
    for(var i = 0; i < sprites.length; i++){
        if(!(sprites[i] instanceof Tile )){
            for(var j = 0; j < sprites.length; j++)
                if(!(sprites[j] instanceof Tile ))
                    if(collisionDetect(sprites[i],sprites[j])){
                        sprites[i].collide = sprites[j].collide = true;
                        var colEvent = new CustomEvent("collision",{detail:{obj1:sprites[i],obj2:sprites[j],i:i,j:j}});
                        window.dispatchEvent(colEvent)
                    }
        }
    }

    if(!game.pause){
        ctx.clearRect(0,0, canvas.width, canvas.height);
        for(var i = 0; i < sprites.length; i++)
            sprites[i].simulate()
    }

    if(!game.pause){
        ctx.clearRect(0,0, canvas.width, canvas.height);
        for(var i = 0; i < sprites.length; i++)
            sprites[i].render(ctx)
    }

   spawnEnemies();

}

function smooth(start,stop){
    smoother(start,(stop-start)/10,10)
}

function smoother(current,inc,n){
    
    if(n == 0){
        if(current > 0)
        current = 0;
        current = Math.round(current)
        game.cscrollspeed = current;
        return;
    }
    else{
    current+=inc;
    game.cscrollspeed = current;
    // document.getElementById("apm").innerHTML = game.cscrollspeed /5 * 100;
    //console.log(current)
    window.setTimeout(smoother,90,current,inc,n-1)
    }
}

function spawnEnemies(){

    var level = getLevel(points);

    sprites = sprites.filter((val,ind)=>{
        if(!(val instanceof Tile))
            return val.position.x >= -50
        else
            return true;
    })

    var shells = sprites.filter((val,ind)=>{
        return val instanceof Shell;
    })

    var bullets = sprites.filter((val,ind)=>{
        return val instanceof Bullet;
    })

    var x;
    if(level == 0)
        x=0.5;
    else
        x = level; 

    var shellCD = (5-x)/(0.125*x) + 30;
    var bulletCD =(5-x)/(0.125*x) + 60;
    

    if(game.shellTimer >= shellCD){
        if(shells.length < 1 + Math.round(level/3)){
            let num = Math.random()
            let speed = num > 0.66?-2:num>0.33?-1:0;
            var sh = createShell(650,40,speed,0,0,0)
            sprites.push(sh)
            setTimeout(()=>{
                sprites[sprites.indexOf(sh)].ready = true;
            },Math.random()*1000+100 )
            game.shellTimer = 0;
        }
    }
    else
        game.shellTimer++;

    if(game.bulletTimer >= bulletCD){
        if(bullets.length < Math.floor(level/3)){ 
            let h = Math.random() * 50 + 100;
            var bl = createBullet(650,245,-1,0,0,0);
            sprites.push(bl)
            setTimeout(()=>{
                sprites[sprites.indexOf(bl)].ready = true;
            },Math.random()*1000+100)
            game.bulletTimer = 0;
        }
    }
    else
        game.bulletTimer++;

    // console.log(shellCD,bulletCD)
    // console.log(game.shellTimer,game.bulletTimer)
    
}

function getLevel(pts){
    return Math.round(1.0045**(pts/4));
}

function collisionDetect(obj1,obj2){
    //does double collision fire
    
    if(obj1 === obj2)
        return false;

    if(obj1.collide && obj2.collide)
        return false;

    if(obj1.position.x < -1 || obj2.position.x < -1||obj1.position.x > 601 ||obj2.position.x > 601)
        return false;
    //SQUARE RADIUS COLLISION
    // var x1 = obj1.position.x + (obj1.width * obj1.scale) / 2
    // var x2 = obj2.position.x + (obj2.width * obj2.scale) / 2
    // var y1 = obj1.position.y + (obj1.height * obj1.scale) / 2
    // var y2 = obj2.position.y + (obj2.height * obj2.scale) / 2
    // var d  = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    // d      = Math.abs(d);
    // var c1 = ((obj1.width * obj1.scale) ** 2 + (obj1.height* obj1.scale) **2) ** 0.5 / 2;
    // var c2 = ((obj2.width * obj2.scale) ** 2 + (obj2.height * obj2.scale) **2) ** 0.5 / 2;
    
    // if( d < c1 + c2){
    //     return true;
    // }
    // else
    //     return false; 

    //ELLIPSES COLLISION

    // var cx1 = obj1.position.x + (obj1.width*obj1.scale/2);
    // var cy1 = obj1.position.y + (obj1.height*obj1.scale/2);

    // var cx2 = obj2.position.x + (obj2.width*obj2.scale/2);
    // var cy2 = obj2.position.y + (obj2.height*obj2.scale/2);

    // var d =Math.sqrt((cx1- cx2)**2 +(cy1 - cy2) ** 2);
    // //calc angle
    // var a = cx2 - cx1;
    // var b = cy2 - cy1;

    // //var deg1 = Math.atan(b / a);
    // var deg1 = Math.asin(b / d);
    // var deg2 = deg1 + Math.PI;
    // //calc r1
    // var a1 = obj1.width*obj1.scale/2;
    // var b1 = obj1.height*obj1.scale/2;

    // var r1 = a1*b1/Math.sqrt(((b1*Math.cos(deg1)) ** 2 + (a1*Math.sin(deg1) ** 2)))

    // //calc r2
    // var a2 = obj2.width*obj2.scale/2;
    // var b2 = obj2.height*obj2.scale/2;

    // var r2 = a2*b2/Math.sqrt(((b2*Math.cos(deg2)) ** 2 + (a2*Math.sin(deg2) ** 2)))
    
    // console.log(obj1,obj2)
    // console.log("A:"+a,"B:"+b)
    // console.log("Deg1:"+deg1)
    
    // // console.log("X:"+cx1+" "+cx2)
    // // console.log("Y:"+cy1+" "+cy2)
    // // console.log("d:"+d,"a1:"+a1,"b1:"+b1)
    // // console.log("d:"+d,"a2:"+a2,"b2:"+b2)


    // if( d < r1 + r2){
    //     return true;
    // }
    // else    
    //     return false

    //SQUARE COLLISION

    var x1 = obj1.position.x;
    var x2 = obj2.position.x;
    var y1 = obj1.position.y;
    var y2 = obj2.position.y;
    var w1 = obj1.width * obj1.scale;
    var h1 = obj1.height * obj1.scale;
    var w2 = obj2.width * obj2.scale;
    var h2 = obj2.height * obj2.scale;

    if(intersects(x1,y1,obj2) || intersects(x1+w1,y1,obj2) || intersects(x1,y1+h1,obj2) || intersects(x1+w1,y1+h1,obj2)
       || intersects(x2,y2,obj1) || intersects(x2+w2,y2,obj1) || intersects(x2,y2+h2,obj1) || intersects(x2+w2,y2+h2,obj1))
        return true;
    else
        return false;
    
}

function getAngle(){

}

function intersects(x1,y1,obj){
    var x2 = obj.position.x;
    var y2 = obj.position.y;
    var w = (obj.width * obj.scale);
    var h =  (obj.height * obj.scale);

    if(x1 >= x2 && x1 <= x2 + w)
        if(y1 >= y2 && y1 <= y2 + h)
            return true

    return false;
}

function collisionHandler(event){
    if(game.paused)
        return;

    var obj1 = event.detail.obj1;
    var obj2 = event.detail.obj2;

    if(obj1 === mario || obj2 === mario){
        clearInterval(clk);
        window.setTimeout(()=>{
            game.pause = false;

            // var cx1 = obj1.position.x + (obj1.width*obj1.scale/2);
            // var cy1 = obj1.position.y + (obj1.height*obj1.scale/2);
        
            // var cx2 = obj2.position.x + (obj2.width*obj2.scale/2);
            // var cy2 = obj2.position.y + (obj2.height*obj2.scale/2);
        
            // var d =Math.sqrt((cx1- cx2)**2 +(cy1 - cy2) ** 2);
            // //calc angle
            // var a = cx2 - cx1;
            // var b = cy2 - cy1;
        
            // //var deg1 = Math.atan(b / a);
            // var deg1 = Math.asin(b / d);
            // var deg2 = deg1 + Math.PI;
            // //calc r1
            // var a1 = obj1.width*obj1.scale/2;
            // var b1 = obj1.height*obj1.scale/2;
        
            // var r1 = a1*b1/Math.sqrt(((b1*Math.cos(deg1)) ** 2 + (a1*Math.sin(deg1) ** 2)))
        
            // //calc r2
            // var a2 = obj2.width*obj2.scale/2;
            // var b2 = obj2.height*obj2.scale/2;
        
            // var r2 = a2*b2/Math.sqrt(((b2*Math.cos(deg2)) ** 2 + (a2*Math.sin(deg2) ** 2)))

            // ctx.beginPath();

            // ctx.strokeStyle = "#FF0000";
            // ctx.moveTo(cx1, cy1);
            // ctx.lineTo(r1*Math.cos(deg1)+cx1, r1*Math.sin(deg1)+cy1);


            // ctx.strokeStyle = "#00FF00";
            // ctx.moveTo(cx2, cy2);
            // ctx.lineTo(r2*Math.cos(deg2)+cx2, r2*Math.sin(deg2)+cy2);

            // ctx.stroke();

            // ctx.strokeStyle = "#FFFFFF";

            // ctx.ellipse(cx1,cy1,a1,b1,0,0,Math.PI*2);
            // ctx.ellipse(cx2,cy2,a2,b2,0,0,Math.PI*2);

            ctx.strokeRect(obj1.position.x,obj1.position.y,obj1.width*obj1.scale,obj1.height*obj1.scale)
            ctx.strokeRect(obj2.position.x,obj2.position.y,obj2.width*obj2.scale,obj2.height*obj2.scale)
            ctx.stroke();

        },1)
    }
    else if(obj1 instanceof Shell && obj2 instanceof Shell){
        
        let i = event.detail.i;
        let j = event.detail.j;
        var x1 = sprites[i].velocity.x;
        var x2 = sprites[j].velocity.x;

        sprites[i].velocity.x = x2;
        sprites[j].velocity.x = x1;
        console.log("shell Collide")

        setTimeout(()=>{
            sprites[i].collide = sprites[j].collide = false;
        },10)
        //console.log(sprites[i].velocity.x,sprites[j].velocity.x)
    }
        

}

function getRadius(obj){
    return 0;
}


for(var i = 0; i < 7; i++)
    for(var j = 0; j < 5;j++)
        tileset.tile.push({x:16+(i*72),y:24+(j*72)})

var image = new Image()
var shell = new Image();
var bb = new Image();
var shell1 = new Shell();
var bb1 = new Bullet();
var tile1 = new Image();

tile1.src = tileset.SS;
image.src = mario.SS;
shell.src = shell1.SS;
bb.src = bb1.SS;

image.onload = ()=>{
    console.log("mario SS done")
    mario.position.y=300-27;
    mario.position.x = 100;
    mario.image = image;
    mario.anime = [mario.stand,mario.run,mario.jump];
    //mario.animate(ctx);
    mario.ready = true;
    sprites.push(mario);
}

shell.onload=()=>{
    console.log("shell done")
}

bb.onload = ()=>{
    console.log("Bullet Bill done")
}

tile1.onload=()=>{
    //Draw board
    for(var i = 0; i <39; i++){
        var tl0=new Tile(tile1,{x:i*16,y:300},tileset.tile[17]);
        sprites.push(tl0);
        game.tiles.push(tl0);
        for(var j = 0; j < 7; j++){
            //sprites.push(new Tile(tile1,{x:i*16,y:j*16},tileset.tile[(i+j)%35]))
            var tl = new Tile(tile1,{x:i*16,y:300+j*16},tileset.tile[18])
            sprites.push(tl);
            game.tiles.push(tl);
        }
    }
}

window.addEventListener("collision",collisionHandler);

window.addEventListener("keydown",(event)=>{


    if(event.keyCode == 80)
        game.paused = !game.paused;

    if(game.paused){
        document.getElementById("pause").style.display = "initial";
        return;
    }
    else  if(!game.paused)
        document.getElementById("pause").style.display = "none";

    if(press == ""){
        if(event.keyCode == 70){
            press = "f";
            action++;
        }
        if(event.keyCode == 74){
            press="j";
            action++;
        }
        
    }
    
    if(press == "j")
        if(event.keyCode == 70){
            action++;
            press = "f";
    }
    if(press == 'f')
        if(event.keyCode == 74){
            action++;
            press="j";
        }   
        
    if(event.keyCode == 32)
        if(mario.position.y >= 300 - mario.height)
            mario.velocity.y += -10;

    })

    
window.setInterval(()=>{
        if(game.pause)
            return;
    
        apm = action*60/10;
        action = 0;
        document.getElementById("apm").innerHTML = "Speed: "+ (apm + Math.floor(points/1000));
        game.scrollspeed = (-1.5  * (apm/100));// * (500*Math.log10(points ** 3))/6000;
        smooth(game.cscrollspeed,game.scrollspeed*5);
    },1000)
    
window.setInterval(()=>{
        if(game.pause)
            return

        points += Math.round(apm/10)
        document.getElementById("points").innerHTML =  "points: " + points;
    },100)