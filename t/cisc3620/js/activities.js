function copyCode(n) {
    src = document.getElementById("act"+n+"_src");
    dst = document.getElementById("act"+n+"_dst");
    dst.textContent = src.textContent;
}

function revealLater (timestring) {
    var later = new Date(timestring);
    document.getElementById("later").innerHTML = later.toLocaleString();
    var now = new Date();
    if( now > later ) {
        document.getElementById("solutions").style.display = "block"; // $("#solutions").show();
        document.getElementById("solutions_later").style.display = "none";
    } else {
        document.getElementById("solutions").style.display = "none";
        document.getElementById("solutions_later").style.display = "block";
    }      
}

/* This effect allows you to click on an answer that has been "ruled
   out" for some reason. It will fade out. */
function hideAnswer() {
    $("pre",this)
        .css('border-color','red')
        .css('background-color','#FF8080')
        .fadeOut(1000);
    $("p",this)
        .css('border-color','red')
        .css('background-color','#FF8080')
        .fadeOut(1000);
}

// $("ol[type=A] li").click(hideAnswer);


