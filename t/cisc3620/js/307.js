"use strict";

/* Functions to get and set cookies, based on code from 
   http://www.w3schools.com/js/js_cookies.asp and
   http://www.elated.com/articles/javascript-and-cookies/

   Updated with code from http://www.quirksmode.org/js/cookies.html
   Fall 2011

   Scott D. Anderson
   Fall 2009
*/


/* This function based on http://www.w3schools.com/js/js_cookies.asp.

Takes the name and value of the cookie (both strings) and the number of
days for the cookie to last (an integer, presumably).  expire_days is
optional; you can omit it and get a cookie that expires when the browser
closes.  Path is a pathname for a set of pages that should process this
cookie.  The default is the directory of the page setting the cookie.  You
might set it to "/" if you want every page in your domain
(e.g. cs.wellesley.edu) to match, or /~youraccount/ to restrict the cookie
to just your account.

Example: The following code sets the cookie named "zip_code" to a value
gotten from the user, default value of 02481.  It will expire in a week.

var zip = prompt("What is your zip code","02481");
setCookie("zip_code",zip,7);

*/

function setCookie(cookie_name,value,expire_days,path) {
    // This "if" avoids user errors where they pass in an undefined
    // variable as the name of the cookie
    if( typeof(cookie_name) == "undefined") {
        alert("cookie name is not defined");
        return;
    }
    // Similarly, this avoids user errors where they pass in an undefined
    // variable as the name of the cookie
    if( typeof(value) == "undefined") {
        alert("cookie value is not defined");
        return;
    }
    // The "escape()" function encodes characters that would be
    // problematic in a cookie value, such as spaces, semi-colons and
    // other punctuation, etc.  We don't encode the cookie name because
    // we're assuming it's a simple string.  We should probably check...
    var cookie_string = cookie_name+"="+escape(value);
    // now, add on the expiration date, if any.  Note that Quirksmode.org
    // states that the syntax is very picky: it must be a semicolon, then
    // one space, then the value.
    if( expire_days != null ) {
        var expiration_date = new Date();
        expiration_date.setDate(expiration_date.getDate()+expire_days);
        cookie_string = cookie_string + "; expires="+expiration_date.toGMTString();
    }
    // add on the path, if any.  Again, semi-colon, space, value
    if( path != null ) {
        cookie_string = cookie_string + "; path="+path
    }
    // Finally, set the cookie.
    document.cookie = cookie_string;
}

/* This function removes or deletes a cookie.  It does so by setting the
 * expiration date to yesterday.  It also sets the value to the empty
 * string, so it's indistinguishable from a cookie that's not set. */

function unsetCookie(cookie_name) {
    setCookie(cookie_name,"",-1);
}

/* This function also based on http://www.w3schools.com/js/js_cookies.asp
Takes a cookie name (a string) and returns its value, also a string.
If there is no such cookie, returns the empty string.

Example: The following code gets the cookie named "zip_code," if any.

var zip = getCookie("zip_code");

*/

function getCookie(cookie_name) {
    // first, see if there is a cookie at all
    if (document.cookie.length == 0) {
        return "";
    }
    // The indexOf method looks for the name of the cookie and the "="
    // that separates the cookie's name from the cookie's value.  It
    // returns the location, if it finds it, otherwise -1, so -1 means no
    // cookie was found.
    var cookie_name_start_index = document.cookie.indexOf(cookie_name+'=');
    if (cookie_name_start_index == -1) {
        return "";
    }
    // The cookie's value starts farther on from the cookie name that we
    // found earlier.
    var cookie_value_start_index = cookie_name_start_index + cookie_name.length+1;
    // The cookie's valie ends with a semi-colon, so look for that to mark
    // the end.
    var cookie_value_end_index = document.cookie.indexOf(";",cookie_value_start_index);
    if( cookie_value_end_index == -1 ) {
        // No semi-colon, so use the end of the string
        cookie_value_end_index = document.cookie.length;
    }
    // The substring method extracts a part of a string.
    var cookie_value = document.cookie.substring(cookie_value_start_index,cookie_value_end_index);
    // in case there are odd characters in the cookie value that were escaped, unescape them
    return unescape(cookie_value);
}
            
// ================================================================

/* Function to return the all the cookies as a pretty string. */

function allCookiesPretty() {
    if (document.cookie == '') {
        return "This document has no cookies.\n";
    } 
    var cookies = document.cookie.split(';');
    var cookie_display='This document has '+cookies.length+' cookies: \n';
    for( var i=0; i<cookies.length; i++ ) {
        cookie_display += '\t'+cookies[i]+'\n';
    }
    return cookie_display;
}

function eraseAllCookies() {
    var cookies = document.cookie.split(';');
    for( var i=0; i<cookies.length; i++ ) {
        var cookie_data = cookies[i].split('=');
        unsetCookie(cookie_data[0]);
    }
}
 
// ================================================================

// Useful functions in CS307 readings and lecture notes

function showelt(elt) {
    var visible = elt.visiblep | false;
    var kids = elt.children;
    for( i = 0; i < kids.length; i++ ) {
        kids[i].style.display = visible ? 'none' : 'block';
    }                       
    elt.visiblep = ! visible;                
}

function gotolinktext(elt) {
    var text = elt.innerHTML;
    var url_before = elt.href;
    var url_after = url_before+encodeURIComponent(text);
    alert(url_after);
    elt.href=url_after;
    return true;
}                    

function wolfram(elt) {
    var text = elt.innerHTML;
    var url_before = 'http://www.wolframalpha.com/input/?i=';
    var url_after = url_before+encodeURIComponent(text);
    elt.href=url_after;
    return true;
}                    

// ================================================================
// For Math in HTML.  Need to learn how to do this properly

// ================================================================

// For pytw demos.  Give the relative URL starting at public_html in the
// click text.

function demo(elt) {
    var text = elt.innerHTML;
    var url_before = '../';
    var url_after = url_before+text;
    elt.href=url_after;
    return true;
}                    

function wolfram(elt) {
    // Takes a hyperlink element and converts the link text into an href
    // to Wolfram Alpha. Make "wolfram(this)" the onclick attribute of the
    // hyperlink.
    var text = elt.innerHTML;
    var url_before = 'http://www.wolframalpha.com/input/?i=';
    var url_after = url_before+encodeURIComponent(text);
    elt.href=url_after;
    return true;
}                    

function addScriptElements () {
    if( ! jQuery ) {
        throw new Error("jQuery not loaded; can't add execute buttons");
    }
    $.each($(".script_also"),function (i,elt) {
        $elt = $(elt);
        // console.log("i: "+i+" and elt: "+$elt.text());
        try {
            $elt.after($("<script>").text($elt.text()))
        }
        catch (err) {
            console.log("Error in the following code:"+$elt.text());
            throw err;
        }
    });
}

function gohere() {
    if( ! jQuery ) {
        throw new Error("jQuery not loaded; can't add execute buttons");
    }
    var this_id = $(this).attr("id");
    console.log("this_id is "+this_id);
    // This will fail if it already has a fragment
    var here = window.location.href;
    console.log("here is "+here);
    if(this_id) {
        window.location.href += ("#"+ this_id);
    }
}
      
var globalCodeFromExecutablePRE = "none yet";

function addExecuteButtons() {
    if( ! jQuery ) {
        throw new Error("jQuery not loaded; can't add execute buttons");
    }
    $.each($(".executable"),function (i,elt) {
        var $elt = $(elt);
        // console.log("i: "+i+" and elt: "+$elt.text());
        var code = $elt.text();  // this has to be done before any pretty printing!
        $elt.after($("<input class='execute' type=button value='execute it'>")
                   .click(function (e) { globalCodeFromExecutablePRE = code;
                                        try { eval(code); }
                                        catch (err) {
                                            console.log("Error executing "+code);
                                            throw err;
                                        }
                                        // console.log("prevents bubbling");
                                        e.stopPropagation();
                                        return true;
                                      })
                  ); // end of after()
    }); // end of each() args
}

/* the data-codefrom attribute holds the id of the code to be copied into
 * that "pre" element. */

function handle_codefrom() {
    if( ! jQuery ) {
        throw new Error("jQuery not loaded; can't do codefrom");
    }
    var attr = 'data-codefrom';
    var elts = $('['+attr+']');
    console.log('processing '+attr+' for '+elts.length+' matches');
    $.each(elts,function (i,elt) {
        var $elt = $(elt);
        var codefrom = $elt.attr(attr);
        // console.log("id: "+codefrom);
        var src = $("#"+codefrom);
        if( src.length == 0 ) {
            console.log("No match for "+Codefrom+". Did misspell the id?");
            return;
        }
        $elt.html($(src[0]).html()); // copy the code
    });
}
    
/* the data-code-jsfunction attribute holds the name of a JS function
 * whose source code should be copied into that "pre" element. */

function handle_code_jsfunction() {
    if( ! jQuery ) {
        throw new Error("jQuery not loaded; can't do data-code-jsfunction");
    }
    var attr = 'data-code-jsfunction';
    var elts = $('['+attr+']');
    console.log('processing '+attr+' for '+elts.length+' matches');
    $.each(elts,function (i,elt) {
        var $elt = $(elt);
        var val = $elt.attr(attr);
        console.log(attr+" with value: "+val);
        var code;
        try {
            code = (eval(val)).toString();
        } catch ( err ) {
            console.log("Error executing "+val+"; probably undefined");
        }
        // copy the code. using innerHTML gets the code parsed.
        $elt.html(code);
    });
}
    
/* the data-codeurl attribute holds the URL of a file of (presumably) JS
 * code to be copied into that "pre" element. */

var codefiles_to_load = 0;

function handle_codeurl() {
    if( ! jQuery ) {
        throw new Error("jQuery not loaded; can't do codeurl");
    }
    console.log("processing codeurl");
    $.each($("[data-codeurl]"),function (i,elt) {
        var $elt = $(elt);
        var codeurl = $elt.attr('data-codeurl');
        console.log("url: "+codeurl);
        codefiles_to_load++;
        // Ajax call to load the PRE element with the contents of URL
        $elt.load(codeurl,function () { $elt.removeClass("prettyprinted"); codefiles_to_load--; });
    });
    syntaxHighlightAll(5,3000); // five tries, three seconds each
}
    
function syntaxHighlightAll(num_tries,interval) {
    var tries_remaining = num_tries;
    function try_again () {
        if( codefiles_to_load == 0 ) {
            prettyPrint();   // the Google Pretty Printer
        } else {
            tries_remaining --;
            if( tries_remaining > 0 ) {
                setTimeout(try_again,interval);
            } else {
                console.log("Didn't succeed in "+num_tries+" each time waiting "+interval+"ms");
            }
        }
    }
    setTimeout( try_again, interval );
}

// ================================================================
// for code_solutions

/* old 

var magic = getCookie("magic");

function giveMagicWord() {
    if( magic == 'BtVS' ) {
        // console.log("clicked on "+this+" which is "+$(this).attr('data-shown'));
        if( $(this).attr('data-shown') == 'no' ) {
            $("*",this).show();
            $(this).attr('data-shown','yes');
        } else {
            $("*",this).hide();
            $(this).attr('data-shown','no');
        }
    } else {
        magic = prompt("What's the magic word?");
        setCookie("magic",magic,"90");
    }
}

*/

var magicWord = "dumbledore";

function checkMagicWord(evt) {
    // console.log("checking ..."+evt.target);
    var magic = getCookie("magic");
    if( magic == "" ) {
        magic = prompt("what's the magic word?");
        if( magic == magicWord ) {
            setCookie("magic",magic,90,"/");
        }
    }
    if( magic == magicWord ) {
        // toggle just this one
        $(evt.target).closest(".hidden_from_student").children().toggle();
    }
}

function hideFromStudent() {
    // toggle *all* of them
    $(".hidden_from_student")
        .click(checkMagicWord)
        .css({padding:"1ex 1em",width:"100%",border:"2px solid orange"})
        .children().hide();
}

// ================================================================
// Used by to display 4x4 matrices in the camera lecture.

function mat4toHTML (mat4) {
    var result = "<table class='mat4'>\n";
    var i, j;
    for( i = 0 ; i < 4 ; ++i ) {
        result += "<tr>\n";
        for( j = 0 ; j < 4 ; ++j ) {
            result += "<td>"+mat4[4*i+j]+"</td>";
        }
        result += "</tr>\n";
    }
    result += "</table>\n";
    document.write(result);
    return result;
}

// ================================================================
// Used for inline demos on a page

function moveCanvasTo(id) {
    var canvasDiv = document.getElementById(id);
    if(!canvasDiv) { console.log("Couldn't find element "+id); }
    var canvas = TW.lastClickTarget;
    canvas.parentElement.removeChild(canvas);
    canvasDiv.appendChild(canvas);
    console.log("Moved canvas to "+id);
}

function moveCanvases() {
    var canvases = document.getElementsByTagName('canvas');
    var i, len=canvases.length;
    for ( i=0; i<len; i++ ) {
        var canvas = canvases[i];
        var div = document.getElementById('canvasDiv'+i);
        if(!div) {
            console.log("Couldn't find a home for canvas "+i);
        }
        canvas.parentElement.removeChild(canvas);
        div.appendChild(canvas);
        console.log("Moved canvas "+i);
    }
}

        

