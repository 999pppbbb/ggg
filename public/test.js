const canvas = document.getElementsByTagName('canvas')[0];
canvas.style ="border:1px solid #000000";
const ctx = canvas.getContext('2d');

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

  const img = new Image;
   img.src = "/works/1/dc__2020-03-31-18-21-58.jpg"
   img.onload = function() {
     canvas.width = this.width;
     canvas.height = this.height;
    }

    window.onload = function() {

  function redraw() {
    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height); 
    ctx.restore(); 
    ctx.drawImage(img,0,0); 
  }


trackTransforms(ctx);
redraw();

    var lastX=canvas.width/2, lastY=canvas.height/2;

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
        if (!dragged) zoom(evt.shiftKey ? -1: 1 );
    },false);

     var scaleFactor = 1.10;

    var zoom = function(clicks){
        var pt = ctx.transformedPoint(lastX,lastY);
        ctx.translate(pt.x,pt.y);
        var factor = Math.pow(scaleFactor,clicks);
        ctx.scale(factor,factor);
        ctx.translate(-pt.x,-pt.y);
        redraw();
    }


    var handleScroll = function(evt){
        var delta = evt.wheelDelta ? evt.wheelDelta/300 : evt.detail ? -evt.detail : 0;
        if (delta) zoom(delta);
        return evt.preventDefault() && false;
    };

    canvas.addEventListener('mousewheel', handleScroll, false);

}