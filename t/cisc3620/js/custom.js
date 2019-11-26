/* The markdown package creates "pre" elements out of code blocks, but
 * doesn't add the "prettyprint" class that the Google prettify code looks
 * for. So I add it to everything that doesn't say noprettyprint. */

function addPrettyPrintClass() {
    $("pre").each(function () {
        if(!$(this).hasClass('noprettyprint')) {
            $(this).addClass('prettyprint');
        }
    });
}

/* Eventually, we won't need this function, I hope. */

function checkPreElements() {
    return;
    $("pre").each(function () {
        if( this.childElementCount == 0 ) {
            console.log("PRE with zero children: "+this.outerHTML);
        } else if( this.childElementCount > 1 ) {
            alert("PRE with multiple children: "+this.outerHTML);
        } else if( this.firstChild.nodeName !== "CODE" ) {
            alert("PRE without CODE: "+this.innerHTML);
        }
    });
}
    

/* This function should be called *before* any pretty-printing */

function trimPreElements() {
    $("pre > code, pre").each(function () {
        // console.log("before trimming: "+$(this).html());
        $(this).html( $(this).html().trim() );
        // console.log("after trimming: "+$(this).html());
    });
}


/* Create additional PRE elements for displaying examples (elts with class
   "eg"). They will also be pretty printed. Each should have an ID
   attribute, say FOO. You can put the result anywhere, just by creating
   an empty PRE element with the ID FOO_dst.  Otherwise, the display is
   put right after the element.
*/

function addPreExamples() {
    $(".eg").each(function () {
        var srcId = $(this).attr("id");
        console.log("copying "+srcId);
        var dstElt;
        if(!srcId) {
            dstElt = $("<pre>").addClass("prettyprint").insertAfter(this);
        } else {
            var dstId = "#"+srcId+"_dst"; 
            dstElt = $(dstId);
            if(dstElt.length == 0) {
                console.log("Couldn't find "+dstId+"; putting it here");
                dstElt = $("<pre>").addClass("prettyprint").insertAfter(this);
            }
        }
        $(dstElt).text($(this).html().trim());
    });
}
