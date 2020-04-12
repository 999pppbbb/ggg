var xhr = new XMLHttpRequest();
xhr.open("get", "./public/canvas.js", true);
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.text = xhr.responseText;
            document.body.appendChild(script);
        }
    }
};
xhr.send(null);

function callImage(img_src) {

  const canvas = document.getElementsByTagName('canvas')[0];
  const ctx = canvas.getContext('2d');        

  img.src = img_src;
  img.onload = function() {
  canvas.width = this.width;
  canvas.height = this.height;     
      
      trackTransforms(ctx);
      redraw();
      addCanvasEvent(canvas);
      
  };

}

function getWorkCanvas(id) {
  var xhr = new XMLHttpRequest();
  xhr.open("get", "/work/canvas/" + id , true);
  xhr.onreadystatechange = function () {
      
    if (this.readyState == 4 && this.status == 200) {
      img_src = this.responseText;  
      callImage(img_src)       
    }
  };
  xhr.send(null);

}

function getWorkView(id) {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("data").innerHTML = this.responseText;  
        getWorkCanvas(id);
      }
      
    };   
    xhttp.open("GET", "/work/view/" + id , true);
    xhttp.send();

}  





