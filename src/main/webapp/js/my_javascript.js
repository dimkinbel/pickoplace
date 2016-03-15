// todo(egor-js): remove?
var rectangles = {};
var rect2div = {};

var canvas = oCanvas.create({
	canvas: "#canvas",
	background: "#ccc"
});
function addRect() {
   var rectangle = canvas.display.rectangle({
	x: 77,
	y: 100,
	width: 200,
	height: 100,
	fill: "#000"
  });
  rectangle.bind("click tap", function () {
	this.rotate(45);
	canvas.redraw();
  });
  var random = randString(12);
  rectangle.randomdiv = random;
   $('#result_wrapper').append('<div class="obj_mirror" id="'+ random + '"  style="position:absolute" ></div>');
  canvas.addChild(rectangle);
  rectangle.dragAndDrop({
	start: function () {
		this.fill = getRandomColor();
	},
	move: function () {
		//this.fill = "#0f0";
	},
	end: function () {
		this.fill = getRandomColor();
		mirror(random,Math.round(this.x),Math.round(this.y),Math.round(this.width),Math.round(this.height));
	}
 });
  
}
var rectangle = canvas.display.rectangle({
	x: 77,
	y: 100,
	width: 200,
	height: 100,
	fill: "#000"
});
var rectangle2 = canvas.display.rectangle({
	x: 3,
	y: 3,
	width: 100,
	height: 100,
	fill: "#FFF"
});
canvas.addChild(rectangle);
canvas.addChild(rectangle2);

rectangle.dragAndDrop({
	start: function () {
		this.fill = getRandomColor();
	},
	move: function () {
		//this.fill = "#0f0";
	},
	end: function () {
		this.fill = getRandomColor();
		mirror("rec1",Math.round(this.x),Math.round(this.y),Math.round(this.width),Math.round(this.height));
	}
});
rectangle2.dragAndDrop({
	start: function () {
		this.fill = getRandomColor();
		//this.fill = "#cf0";
	},
	move: function () {
		//this.fill = getRandomColor();
		//this.fill = "#cf0";
	},
	end: function () {
	    this.fill = getRandomColor();
		//this.fill = "#c00";
		mirror("rec2",Math.round(this.x),Math.round(this.y),Math.round(this.width),Math.round(this.height));
	}
});
function mirror(id,x,y,w,h) {
   $('#'+id).css("left",x);
   $('#'+id).css("top",y);
   $('#'+id).css("width",w);
   $('#'+id).css("height",h);
}


function getRandomColor() {
  //return Math.floor(Math.random() * (250 - 0 + 1)) + 0;
  var r = Math.floor(Math.random() * (250 - 0 + 1)) + 0;
    var g = Math.floor(Math.random() * (250 - 0 + 1)) + 0;
    var b = Math.floor(Math.random() * (250 - 0 + 1)) + 0;
	var color = "rgb(" + r + "," + g + "," + b + ")";
	return color;
}
function randString(x){
    var s = "";
    while(s.length<x&&x>0){
        var r = Math.random();
        s+= (r<0.1?Math.floor(r*100):String.fromCharCode(Math.floor(r*26) + (r>0.5?97:65)));
    }
    return s;
}




