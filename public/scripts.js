var xhr = new XMLHttpRequest();
xhr.open("get", "http://localhost:3000/public/canvas.js", true);
xhr.onreadystatechange = function () {

  if (this.readyState == 4 && this.status == 200) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.text = xhr.responseText;
            document.body.appendChild(script);     
    }
};
xhr.send(null);

function getWorkView(id) {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("data").innerHTML = this.responseText;      
        
        if(document.getElementById("filepath").innerHTML == "") {
          document.getElementById("canvas").style.display = "none";
          img.src = "";
          img.onload();

        } else {
          document.getElementById("canvas").style.display = "block";
          img.src = document.getElementById("filepath").innerHTML;
          img.onload();
        }
      }
      
    };   
    xhttp.open("GET", "/works/view/" + id , true);
    xhttp.send();

}  






