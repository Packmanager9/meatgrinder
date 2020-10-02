let floors = []
let floormpf = [...floors]
let meats = []
const tutorial_canvas = document.getElementById("tutorial");
const tutorial_canvas_context = tutorial_canvas.getContext('2d');
tutorial_canvas.style.background = "#664613"
class Circle{
    constructor(x, y, radius, color, xmom = 0, ymom = 0){
        this.height = 0
        this.width = 0
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.xmom = xmom
        this.ymom = ymom
        this.xrepel = 0
        this.yrepel = 0
        this.lens = 0
    }       
     draw(){
        tutorial_canvas_context.fillStyle = this.color
        tutorial_canvas_context.lineWidth = 0
        tutorial_canvas_context.strokeStyle = this.color
        tutorial_canvas_context.beginPath();
        tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
        tutorial_canvas_context.fill()
        tutorial_canvas_context.stroke(); 
    }
    move(){
        if(this.x+this.radius > safebox.x+safebox.width){
            if(this.xmom > 0){
                this.xmom*=-1
            }
        }
        if(this.x-this.radius < safebox.x){
            if(this.xmom < 0){
                this.xmom*=-1
            }
        }
        if(this.y+this.radius > safebox.y+safebox.height){
            if(this.ymom > 0){
                this.ymom*=-1
            }
        }
        if(this.y-this.radius < safebox.y){
            if(this.ymom < 0){
                this.ymom*=-1
            }
        }
        this.x += this.xmom
        this.y += this.ymom
    }
    isPointInside(point){
        this.areaY = point.y - this.y 
        this.areaX = point.x - this.x
        if(((this.areaX*this.areaX)+(this.areaY*this.areaY)) <= (this.radius*this.radius)){
            return true
        }
        return false
    }
    repelCheck(point){
        this.areaY = point.y - this.y 
        this.areaX = point.x - this.x
        if(((this.areaX*this.areaX)+(this.areaY*this.areaY)) <= (this.radius+point.radius)*(point.radius+this.radius)){
            return true
        }
        return false
    }
}
class Line{
    constructor(x,y, x2, y2, color, width){
        this.x1 = x
        this.y1 = y
        this.x2 = x2
        this.y2 = y2
        this.color = color
        this.width = width
    }
    hypotenuse(){
        const xdif = this.x1-this.x2
        const ydif = this.y1-this.y2
        const hypotenuse = (xdif*xdif)+(ydif*ydif)
        return Math.sqrt(hypotenuse)
    }
    draw(){
        tutorial_canvas_context.strokeStyle = this.color
        tutorial_canvas_context.lineWidth = this.width
        tutorial_canvas_context.beginPath()
        tutorial_canvas_context.moveTo(this.x1, this.y1)         
        tutorial_canvas_context.lineTo(this.x2, this.y2)
        tutorial_canvas_context.stroke()
        tutorial_canvas_context.lineWidth = 1
    }
}
class Meat{ 
    constructor(){
        this.body = new Circle(380, 100, 60, "brown")
        this.body.xmom = 2
        meats.push(this)
        this.cut = 0
    }
    draw(){
        this.body.ymom+=.1
        this.xrepelled = 0
        this.yrepelled = 0
        this.xrepel = 0
        this.yrepel = 0
        for(let f = 0; f<meats.length; f++){
            if(this!==meats[f]){
                if(this.body.repelCheck( meats[f].body)){
                    const distance = ((new Line(meats[f].body.x, meats[f].body.y, this.body.x, this.body.y, 1, "red")).hypotenuse())-(meats[f].body.radius+this.body.radius)
                    const angleRadians = Math.atan2(meats[f].body.y - this.body.y, meats[f].body.x - this.body.x);
                    this.xrepel += (Math.cos(angleRadians)*distance)/2
                    this.yrepel += (Math.sin(angleRadians)*distance)/2
                }
            }
        }
        for(let t = 0;t<grinder.wings.length;t++){
            if(Math.random()<.03){
                if(grinder.wings[t].repelCheck(this.body)){
                    if(this.cut == 0){
                        this.cut = 1
                        let newmeat1 = new Meat()
                        newmeat1.body.x = this.body.x
                        newmeat1.body.y = this.body.y
                        newmeat1.body.radius = this.body.radius*.707
                        newmeat1.body.ymom = this.body.ymom*.5
                        newmeat1.body.xmom = this.body.xmom+(Math.random()-.5)
                        let newmeat2 = new Meat()
                        newmeat2.body.x = this.body.x
                        newmeat2.body.y = this.body.y
                        newmeat2.body.radius = this.body.radius*.707
                        newmeat2.body.ymom = this.body.ymom*.5
                        newmeat2.body.xmom = this.body.xmom+(Math.random()-.5)
                        break
                    }
                }
            }
        }
        if(this.body.x+this.body.radius> safebox.x+safebox.width){
            if(this.xrepel > 0){
                this.xrepel*=-1
            }
        }
        if(this.body.x-this.body.radius< safebox.x){
            if(this.xrepel < 0){
                this.xrepel*=-1
            }
        }
        if(this.body.y+this.body.radius> safebox.y+safebox.height){
            if(this.yrepel > 0){
                this.yrepel*=-1
            }
        }
        if(this.body.y-this.body.radius< safebox.y){
            if(this.yrepel < 0){
                this.yrepel*=-1
            }
        }
        this.body.x+=this.xrepel
        this.body.y+=this.yrepel
        this.body.move()
        this.body.draw()
    }
    clean(){
        if(this.cut == 1){
            meats.splice(meats.indexOf(this),1)
        }
    }
}
 class Spinwheel{
    constructor(x,y){
      this.body = new Circle(x,y, 2, "red")
      this.bigbody = new Circle(x,y, 1900, "red")
      this.wings = []
      this.dis = 1
      this.angle = 0
      this.build()
    }
    build(){
        floors = [...floormpf]
        for(let f = floors.length;f>0;f--){
            if(this.wings.includes(floors[f])){
              if(squarecirclefeetspin(floors[f], meats[t].body)){
                  meats[t].wingthing =this.wings.indexOf(floors[f])
                  meats[t].xdisp = floors[f].x
                  meats[t].ydisp = floors[f].y
                  f = 0
              }
            }
        }
        this.wings = []
        this.dis = 1
        let increment = Math.PI/5
        let angle = this.angle
        for(let w = 0; w<100; w++){
            let wing = new Circle(this.body.x +(1*(Math.cos(angle)*this.dis)), this.body.y +(1*(Math.sin(angle)*this.dis)),3, "green")
            wing.thing = w
            for(let t = 0;t<meats.length;t++){

                if(wing.thing == meats[t].wingthing){
                  if( meats[t].body,repelCheck(wings[w])){
                      meats[t].body.x += wing.x - meats[t].xdisp
                      meats[t].body.y += wing.y - meats[t].ydisp
                  }
                }
            }
            floors.push(wing)
            this.wings.push(wing)
            angle+=increment
            if(w%10 == 0 ){
            this.dis+=8
          }
        }
    }
    draw(){
            this.angle+=.1
            this.build()
            this.body.draw()
            for(let w = 0; w<this.wings.length; w++){
                this.wings[w].draw()
            }
    }
}
function squarecirclefeet(square, circle){
    const squareendh = square.y + square.height
    const squareendw = square.x + square.width
    if(square.x <= circle.x){
        if(square.y <= circle.y+circle.radius){
            if(squareendw >= circle.x){
                if(squareendh >= circle.y){
                    return true
                }
            }
        }
    }
    if(square.x <= circle.x+(circle.radius*.65)){
        if(square.y <= circle.y+circle.radius){
            if(squareendw >= circle.x){
                if(squareendh >= circle.y){
                    return true
                }
            }
        }
    }
    if(square.x <= circle.x){
        if(square.y <= circle.y+circle.radius){
            if(squareendw+(circle.radius*.65) >= circle.x){
                if(squareendh >= circle.y){
                    return true
                }
            }
        }
    }
    return false
    }
    class Rectangle {
        constructor(x, y, height, width, color) {
            this.wall = 0
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
        }
        draw(){
            tutorial_canvas_context.fillStyle = this.color
            tutorial_canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move(){
            this.x+=this.xmom
            this.xmom *= .97
            this.y+=this.ymom
        }
        isPointInside(point){
            if(point.x >= this.x){
                if(point.y >= this.y){
                    if(point.x <= this.x+this.width){
                        if(point.y <= this.y+this.height){
                        return true
                        }
                    }
                }
            }
            return false
        }
    }
    let meat = new Meat()
    let safebox = new Rectangle(200,0,510,300, "black")
    let grinder = new Spinwheel(350,350)
window.setInterval(function(){ 
        tutorial_canvas_context.clearRect(0,0,700,700)
        safebox.draw()
        grinder.draw()
        for(let t = 0;t<meats.length;t++){
            meats[t].draw()
        }
        for(let t = 0;t<meats.length;t++){
            meats[t].clean()
        }
},  14) 