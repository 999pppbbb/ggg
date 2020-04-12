function draw() {
    ctx.canvas.width  = img.width;
    ctx.canvas.height = img.height;      
    ctx.drawImage(img,0,0);
  } 

  function expand() {

    ctx.canvas.width  = img.width;
    ctx.canvas.height = img.height;      
    ctx.drawImage(img,0,0);
    ctx.scale(factor, factor)

} 




const canvas = document.getElementsByTagName('canvas')[0];
canvas.style ="border:1px solid #000000";
const ctx = canvas.getContext('2d');


const img = new Image;
img.src = "/works/test.jpg"
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
    ctx.getTransform = function(){ return xform; };

    var pt  = svg.createSVGPoint();
    ctx.transformedPoint = function(x,y){
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

    var lastX=canvas.width/2;
    var lastY=canvas.height/2;
    var dragStart,dragged;

    canvas.addEventListener('mousedown',function(evt){
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragStart = ctx.transformedPoint(lastX,lastY);
        dragged = false;
    },false);

    canvas.addEventListener('mousemove',function(evt){
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragged = true;
        if (dragStart){
        var pt = ctx.transformedPoint(lastX,lastY);
        ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
        redraw();
            }
    },false);

    canvas.addEventListener('mouseup',function(evt){
        dragStart = null;
        if (!dragged) zoomInOut(evt.shiftKey ? -1: 1 );
    },false);

    var scaleFactor = 1.1;
    var zoom = function(clicks){
        var pt = ctx.transformedPoint(lastX,lastY);
        ctx.translate(pt.x,pt.y);
        var factor = Math.pow(scaleFactor,clicks);
        ctx.scale(factor,factor);
        ctx.translate(-pt.x,-pt.y);
        redraw();
    }

    var handleScroll = function(evt){
        console.log(evt);
        var delta = evt.wheelDelta ? evt.wheelDelta/1000 : evt.detail ? -evt.detail : 0;
        if (delta) zoom(delta);
        return evt.preventDefault() && false;
    };
    canvas.addEventListener('mousewheel', handleScroll, false);
}

function zoomInOut(click) {

    var factor = Math.pow(1.10 , click);
    ctx.scale(factor, factor)
    redraw();    
    
}