function getWorkView(id) {
  var xmlhttp;
  if (window.XMLHttpRequest) {
      // code for modern browsers
      xmlhttp = new XMLHttpRequest();
  } else {
      // code for old IE browsers
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

  }

  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          document.getElementById("data").innerHTML = this.responseText;
		  var mainview = document.getElementById('mainView');
		  console.log('mainview',mainview);
          mainview.style.height = document.body.clientHeight + 'px';
          mainview.style.width = document.body.clientWidth + 'px';
          var filepath = document.getElementById("filepath").innerHTML;
          mainview.setAttribute('data', 'http://localhost:3000' + filepath);
      }
  };
  xmlhttp.open("get", "http://localhost:3000/works/view/" + id, true);
  xmlhttp.send(null);
}


function toggleView() {
  let view = document.getElementsByClassName("view")[0].style.display

  if (view == 'block') {
      document.getElementsByClassName("view")[0].style.display = 'none';
      document.getElementsByClassName("view_tab")[0].style.display = 'block';
  } else {
      document.getElementsByClassName("view")[0].style.display = 'block';
      document.getElementsByClassName("view_tab")[0].style.display = 'none';

  }
}


//svg-pan-zoom ===>

var svg;
var zoomFactor = 1.1;
var isPointerDown = false;
var viewBox = {	x: 0, y: 0, width: 0, height: 0 };
var pointer = { originX: 0, originY: 0, nowX: 0, nowY: 0 };
var dragged = false;

//mouseWhellHandler
var parentRect;
var rect;
var oldscale = 1;
var scale = 1;
//

function getViewBox(svg) {
	var box = svg.getAttribute('viewBox');
    return {x: parseInt(box.split(' ')[0], 10), y: parseInt(box.split(' ')[1], 10), width: parseInt(box.split(' ')[2], 10), height: parseInt(box.split(' ')[3], 10)};
};

function setupHandlers(root) {
    svg = root.firstElementChild;    
    viewBox = getViewBox(svg);
	root.addEventListener('mousedown', mouseDown);
	root.addEventListener('mousemove', mouseMove);
	root.addEventListener('mouseup', mouseUp);	
	root.addEventListener('mousewheel', mouseWheelHandler);	
}

function mouseWheelHandler(evt){
    var e = window.event || evt;
    var pgX = e.pageX,
        pgY = e.pageY;
    console.log('pgX, pgY', pgX, pgY);
    console.log('svg', svg);
    rect = svg.getBoundingClientRect();
    console.log('rect', rect);
    parentRect = document.getElementById("mainView").getBoundingClientRect();
    console.log('parentRect', parentRect);

    var delta = Math.max(-1, Math.min(1, (evt.wheelDelta || -evt.detail)));
    oldScale = scale;
    scale += (delta / 10);
    if(scale < 1) scale = 1;
    if(scale > 7) scale = 7;

    var xPercent = ((pgX - rect.left) / rect.width).toFixed(2);
    var yPercent = ((pgY - rect.top) / rect.height).toFixed(2);
    var left = Math.round(pgX - parentRect.left - (xPercent * (rect.width * scale / oldScale)));
    var top = Math.round(pgY - parentRect.top - (yPercent * (rect.height * scale / oldScale)));
    
    var x = viewBox.x;
    var y = viewBox.y;
    var w = left;
    var h = top;

    var viewBoxString = `${x} ${y} ${w} ${h}`; 
    svg.setAttribute('viewBox', viewBoxString);  

}
  
function mouseMove(evt) {    
	if (!isPointerDown) return;	   
	var ratio = viewBox.width / svg.getBoundingClientRect().width;    
	pointer.nowX = viewBox.x - ((evt.offsetX - pointer.originX) * ratio);
    pointer.nowY = viewBox.y - ((evt.offsetY - pointer.originY) * ratio);    
	var viewBoxString = `${pointer.nowX} ${pointer.nowY} ${viewBox.width} ${viewBox.height}`; 
    svg.setAttribute('viewBox', viewBoxString);    
    dragged = true;
}

function mouseUp(evt) {    
    isPointerDown = false;    
	if (dragged){                
        viewBox.x = pointer.nowX;
        viewBox.y = pointer.nowY;     
        viewBox = getViewBox(svg);        
        dragged = false;        
    } else {        
        viewBox = getViewBox(svg);
        pointer.nowX = evt.screenX;
        pointer.nowY = evt.screenY;
        zoomIn(viewBox);
        viewBox = getViewBox(svg);
    } 
    pointer.nowX = evt.offsetX;
    pointer.nowY = evt.offsetY;
    console.log('mouseup - viewBox', viewBox);
    
}

function zoomIn(viewBox){    
    var viewBoxString = `${viewBox.x} ${viewBox.y} ${viewBox.width/zoomFactor} ${viewBox.height/zoomFactor}`; 
    svg.setAttribute('viewBox', viewBoxString);   
}

function mouseDown(evt) {    
    console.log('mousedown - viewBox.x', viewBox.x);
    isPointerDown = true;
	pointer.originX = evt.offsetX;
    pointer.originY = evt.offsetY;    
}