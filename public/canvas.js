function reset() {
    ctx.canvas.style.width = 'auto';
    img.onload();
} 
function expand() {
    ctx.canvas.style.width = '100%';
    img.onload();
} 
    
function moveLeft() {
    ctx.translate(ctx.canvas.width/79, 0);
    redraw();
} 

function moveRight() {
    ctx.translate(ctx.canvas.width/-79, 0);
    redraw();
    
} 

function moveTop() {
    ctx.translate(0, ctx.canvas.width/79);
    redraw();    
} 

function moveBottom() {
    ctx.translate(0, ctx.canvas.width/-79);
    redraw();    
} 

function zoomInOut(click) {
    var factor = Math.pow(1.10 , click);
    ctx.scale(factor, factor)
    redraw();        
}

const canvas = document.getElementById("canvas-img");
canvas.style ="border:1px solid #000000";
const ctx = canvas.getContext('2d');

const img = new Image;
img.src = "";
img.onload = function() {
  canvas.width = this.width;
  canvas.height = this.height;
  trackTransforms(ctx);
  redraw();
  addCanvasEvent(canvas);
 } 


function trackTransforms(ctx) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    var xform = svg.createSVGMatrix();
    var pt  = svg.createSVGPoint();
    ctx.transformedPoint = function(x,y) {
        pt.x=x; pt.y=y;
        return pt.matrixTransform(xform.inverse());
    }
  }

function redraw() {

    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height); 
    ctx.restore(); 
    ctx.drawImage(img,0,0); 
  
}


function addCanvasEvent(canvas) {
    
    var dragStart, dragged;

    canvas.addEventListener('mousedown',function(evt) {
        dragStart = ctx.transformedPoint(evt.x , evt.y);
        dragged = false;
    },false);

    canvas.addEventListener('mousemove',function(evt) {
        dragged = true;
        if ( dragStart ) {
            ctx.translate(evt.x - dragStart.x, evt.y - dragStart.y);
            redraw();
        }
    },false);

    canvas.addEventListener('mouseup',function(evt) {
        dragStart = null;
        if (!dragged) zoomInOut(evt.shiftKey ? -0.1: 0.1 ); 
    },false);

    var handleScroll = function(evt) {
        console.log(evt.x);
        var delta = evt.wheelDelta ? evt.wheelDelta/1000 : evt.detail ? -evt.detail : 0;
        if (delta) zoomInOut(delta);
        return evt.preventDefault() && false;
    };

    canvas.addEventListener('mousewheel', handleScroll, false);

    window.addEventListener('keydown', (evt) => {
        if(evt.keyCode == 38) moveTop()
        if(evt.keyCode == 40) moveBottom()
        if(evt.keyCode == 37) moveLeft()
        if(evt.keyCode == 39) moveRight()
        if(evt.keyCode == 107) zoomInOut(0.1)
        if(evt.keyCode == 109) zoomInOut(-0.1)
        if(evt.keyCode == 38 && evt.ctrlKey) zoomInOut(0.1)
        if(evt.keyCode == 40 && evt.ctrlKey) zoomInOut(-0.1)        
    })


}