        const canvas = document.getElementsByTagName('canvas')[0];
        const ctx = canvas.getContext('2d');
        trackTransforms(ctx); //마우스휠 움직일 수 있게 함
        
        const img = new Image;
         img.src = filepath;
         img.onload = function() {
           canvas.width = this.width;
           canvas.height = this.height;
          }
        
        window.onload = function(){
        
            function redraw(){
              ctx.save(); //Saves the state of the current context
              ctx.setTransform(1,0,0,1,0,0); //Resets the current transform to the identity matrix. Then runs transform()
              //setTransform(a,b,c,d,e,f)
              //a-Horizontal scaling
              //b-Horizontal skewing
              //c-Vertical skewing
              //d-Vertical scaling
              //e-Horizontal moving
              //f-Vertical moving
              ctx.clearRect(0,0,canvas.width,canvas.height); //Clears the specified pixels within a given rectangle //캔버스크기만큼 화면지움
              ctx.restore(); //Returns previously saved path state and attributes
              ctx.drawImage(img,0,0); //Draws an image, canvas, or video onto the canvas
            }
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
        
              canvas.addEventListener('mousewheel',handleScroll,false);
            };
        
            function trackTransforms(ctx){
              var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
              var xform = svg.createSVGMatrix();
              ctx.getTransform = function(){ return xform; };
        
              var pt  = svg.createSVGPoint();
              ctx.transformedPoint = function(x,y){
                  pt.x=x; pt.y=y;
                  return pt.matrixTransform(xform.inverse());
              }
            }
        
        
            function goBack() {
                window.history.back();
            }
        