---
layout: default
title: Interaction
javascripts:
  - https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML
stylesheets:
  - /css/rouge.css
  - ../css/3620.css
---

# Interaction

<p style="display:none">
\(
\newcommand{\Choose}[2]{ { { #1 }\choose{ #2 } } }
\newcommand{\vecII}[2]{\left[\begin{array}{c} #1\\#2 \end{array}\right]}
\newcommand{\vecIII}[3]{\left[\begin{array}{c} #1\\#2\\#3 \end{array}\right]}
\newcommand{\vecIV}[4]{\left[\begin{array}{c} #1\\#2\\#3\\#4 \end{array}\right]}
\newcommand{\matIIxII}[4]{\left[
    \begin{array}{cc}
      #1 & #2 \\ #3 & #4 
    \end{array}\right]}

\newcommand{\matIIIxIII}[9]{\left[
    \begin{array}{ccc}
      #1 & #2 & #3 \\ #4 & #5 & #6 \\ #7 & #8 & #9
    \end{array}\right]}
\)        
</p>


So far, we've mostly been creating images and animations, rather than
interacting with the user. Our interaction has mostly been limited to keyboard
callbacks using TW or GUI controls, and even that has been mostly toggling
global settings such as lighting or textures, or adjusting parameters. This is
fine for producing animations (after all, Pixar movies aren't interactive),
but if we want to do games and other kinds of interactive software, we'll need
to do better. In this reading, we'll start digging into how to have a more
interactive program.

Note that user interaction isn't really part of OpenGL per se. OpenGL is about
graphics, not about handling mouse clicks or keyboard input, or tangible user
interfaces or any of the many other ways that we can imagine interacting with
our devices.

Nevertheless, if you want to build a game or any other software that combines
computer graphics with user interaction (even an animation might have a
"pause/resume" feature), we'll want to confront this.

## Interaction in a Web Browser

Web browsers have a reasonably straightforward way of handling keyboard input
-- until you start looking into it more deeply. Then it becomes a
[mess](http://www.unixpapa.com/js/key.html). But, let's ignore the mess for
now and start with some straightforward elements.

When the keyboard changes state (a key goes up or down ...) the browser
generates an _event_ , which you can add a _handler_ for. The easiest one to
work with is `keyPress`. (The [ keypress event is
deprecated](http://www.w3.org/TR/DOM-Level-3-Events/#event-type-keypress), but
may still be supported by most browsers for the foreseeable future.) Here's
how you bind it:

    
```javascript
    document.addEventListener('keypress', onKeyPress);
    
    function onKeyPress (event) {
       var key = event.keyCode;
       ...
    }
```

As you can see, you bind the `keypress` event to a callback function that is
invoked whenever a key is pressed. This callback function is invoked with an
object that represents all the information about the event. The property we
will care about is the `keyCode` (which is _also_ deprecated, but, ~~Google
Chrome doesn't provide`key`~~ as of Fall 2018 Chrome 69.x provides `key`,
which is the [intended replacement](http://www.w3.org/TR/DOM-
Level-3-Events/#widl-KeyboardEvent-key). Again, we'll proceed as if all is
well, which it probably will be).

The `keyCode` property returns a numerical code for the key, which is just the
Unicode codepoint for the character (we'll mostly stick to
[ASCII](http://asciitable.com/)), but if you want to handle a broader range of
characters, be my guest.

Working with numerical codes is awkward at best, and a recipe for unreadable
code at worse. Computer geeks like myself may have memorized the fact that an
upper case 'A' has the numerical code 65, but your code should not have ASCII
or Unicode constants like that in it. To convert a Unicode codepoint to a
character, you can do this:

    
```javascript
    function onKeyPress (event) {
       var key = event.keyCode;
       var ch = String.fromCharCode(key);
       alert("You typed a " + ch);
       ...
    }
```

The `key` attribute of the event object is already a character, so if you use
`key`, you can skip this conversion.

What you'll next want to do is figure out what key was pressed and then do
something appropriate. For now, let's imagine that what you want to do is
something to create a
[WASD](http://en.wikipedia.org/wiki/Arrow_keys#WASD_keys) interface to move an
avatar around the scene while using a mouse with your right hand:

    
```javascript
    function onKeyPress (event) {
       var key = event.keyCode;
       var ch = String.fromCharCode(key);
       switch (ch) {
           case 'w': goForward(); break;
           case 's': goBackward(); break;
           case 'a': goLeft(); break;
           case 'd': goRight(); break;
           default:
               console.log("key " + ch + " is not handled");
       }
    }
```

As an aside, note that the code above "hard codes" the meaning of each key and
isn't extensible or customizable. You can't, for example, easily switch to
ESDF or IJKL, if you wanted to.

One option is to store the mapping from characters to functions (this mapping
is called _key bindings_ ) in an _array_. The contents of the array can easily
be modified to re-bind the keys.

This is what TW does, and functions like `TW.setKeyboardCallback()` just sets
an element of the array. Here's what the keypress event handler looks like:

    
```javascript
    function onKeyPress (event) {
        var key = event.keyCode;
        var ch = String.fromCharCode(key);
        if( typeof keybindings[key] === 'function' ) {
            keybindings[key](event);  // invoke the function
        } else {
            console.log('no binding for key ' + key + ' (' + ch + ')');
        }
    }
```javascript


and then you populate the array like this:

    
```javascript
    keybindings['w'.charCodeAt(0)] = goForward;
    keybindings['s'.charCodeAt(0)] = goBackward;
    keybindings['a'.charCodeAt(0)] = goLeft;
    keybindings['d'.charCodeAt(0)] = goRight;
```

Notice that the functions are just being stored in the array, they are not
being invoked, so they don't get parentheses after them. The
`String.charCodeAt()` function is the opposite of `String.fromCharCode()`: it
turns a character into its Unicode codepoint, and that numerical value is
perfect for indexing into an array.

There are, of course, many variations on this kind of code. For example,
several similar blocks might be coalesced. You might invoke `TW.render()`
after every keypress, in case it changed the scene, and relieving every
keybinding from having to do that.

The most important disadvantage of using `keypress` is that it only handles
keys that send a Unicode character to the computer. Other keys, most
importantly, the _arrow_ keys and other special keys like `PageUp` and `Home`,
do not generate `keypress` events. If you want to process those, you can use
the `keydown` event, but that provides you with numerical key identifiers, and
those are a pain to process. (For example, both an uppercase and lowercase 'a'
are the same key, so they send the same code. You have to look at the modifier
information. Also, some of the keys send same numbers as certain ASCII codes.
Again, see pages like [JavaScript madness](http://unixpapa.com/js/key.html)
for details.) In this course, we're not going to worry too much about
portability. If it works on your computer and mine, that's good enough.

For simplicity, we'll stick to `keypress`.

Note, another simplification we will make is to bind the keypress event on the
entire document. You can bind the keypress event to any focussable element
(such as an `<input>`), but, alas, a `<canvas>` is not a focussable element.
So, we will be binding the keypresses for the entire document. If you want to
have keypresses mean different things in different elements of your page, you
can track the mouse (or require the user to click on the element they want the
input to go to) and use some conditionals inside your event handler to sort
that out.

The event object can also tell whether the shift, control, alt, or meta keys
are down, so you can treat Control-A differently from "a" or "A."

## Mouse Coordinates

When the monitor redraws the screen, it starts in the upper left corner and
the electron gun sweeps left to right and top to bottom. For that reason,
browsers use a coordinate system where the origin is at the upper left, the
$x$ coordinate increases to the right and the $y$ coordinate increases going
_down_.  The mouse coordinates are reported in _window_ coordinates, which is
in pixels measured from the upper left. If your browser is in a 960 by 500
window, those values will be, respectively, the largest possible $x$ and $y$
coordinates. See this figure:


{% include figure.html url="images/mouse-coords.png" description="Mouse Coordinates are reported with 0,0 in the upper left, and maximum values of window width and window height" classes="" %}

Mouse coordinates are reported with 0,0 in the upper left, and maximum values of
window width and window height

Suppose you want to process mouse clicks, then the event you want to bind is,
unsurprisingly, `mouseclick`. Thus, the code might look like this:

    
```javascript
    document.addEventListener('click', onMouseClick);
    
    function onMouseClick (event) {
        var mx = event.clientX;
        var my = event.clientY;
        console.log("click at (" + mx + "," + my ")");
    }    
```javascript

Don't you wish it were that easy? Unfortunately, when we are using a canvas in
a web browser, the absolute mouse coordinates aren't exactly what we want.
Instead, we'd like to have the coordinates specified relative to where our
canvas is (and there might be more than one). See this figure:


{% include figure.html url="images/canvas-coords.png" description="Canvas coordinates are offset from the the window coordinates" classes="" %}


Canvas coordinates are offset from the window coordinates

Note that most of the Three.js examples use one canvas and have it take over
the entire window, so that there's no difference between the mouse coordinates
relative to the window and the mouse coordinates relative to the canvas. They
do this:

    
```javascript
    canvas { width: 100%; height: 100%; }
```

This is _almost_ correct, but if you need exact coordinates, you may need to
zero out any margins or padding for the `<body>`, which often default to 8px
or so.

To adjust for the location of the canvas within the window, we need to find
out the _target_ of the click (what element was clicked on), and then we can
find out its offset from the window, using the very useful [
getBoundingClientRect()](http://developer.mozilla.org/en-
US/docs/Web/API/element.getBoundingClientRect) function. Suppose that we
previously saved the canvas in a variable `c1`. Our code then becomes:

    
```javascript
    function onMouseClick (event) {
        var mx = event.clientX;
        var my = event.clientY;
        console.log("click at (" + mx + "," + my + ")");
        var target = event.target;
        if( target == c1 ) {
            console.log("clicked on a canvas");
            var rect = target.getBoundingClientRect();
            var cx = mx - rect.left;
            var cy = my - rect.top;
            console.log("clicked on c1 at (" + cx + "," + cy + ")");
        }
    }    
```

If you care about which button was clicked (left, middle, right), the `event`
object has a `button` property that gives the numerical index of the button.
Zero is the left button, one is the middle button, and so forth. It may be
hard to capture a right-click, since the browser usually intercepts that and
processes it specially.

## Mouse Movement

After processing mouse clicks, you may want to process mouse movement, say to
implement _click and drag_. For this, we need a few more events:

    
```javascript
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
```

As before, the event handler is called with an `event` object that has the
information about the event.

To implement dragging, you will need to notice when the mouse button goes down
and up, and when it moves while the mouse is down. Something like this:

    
```javascript
    var isMouseDown = false;
    
    function onMouseDown (event) {
        isMouseDown = true;
    }
        
    function onMouseUp (event) {
        isMouseDown = false;
    }
    
    function onMouseMove (event) {
        if( isMouseDown ) {
            console.log("drag to (" + event.clientX + "," + event.clientY + ")";
        }
    }    
```

Notice that these functions only give you a snapshot of the mouse motion. It
doesn't tell you where the mouse was, how it was moving, or anything like
that. In our geometry terminology, it gives you a _point_ , not a _vector_.
Yet you often want to know what direction the mouse was moving. For example,
in the GUI for moving the camera viewpoint, if you drag the mouse down, you
get a very different effect than if you drag it to the right, even if you end
up at the same location. The callback will only get the location, not the
direction, so how to do this? The answer is simply to keep track of where the
mouse was:

    
```javascript
    var oldMouse = {x:0, y:0};
    
    function onMouseMove (event) {
        if (isMouseDown) {
            console.log("drag to (" + event.clientX + "," + event.clientY + ")"
                        + "from (" + oldMouse.x + "," + oldMouse.y + ")");
            oldMouse.x = event.clientX;
            oldMouse.y = event.clientY;
        }
    }
```

Here is a demo that puts all of these ideas together. Please take a few
minutes to read the source code; it's less than 100 lines of code.

[events.html](../demos/Interaction/events.html)


### Source

This page is based on <https://cs.wellesley.edu/~cs307/readings/interaction-1.html>. Copyright &copy; Scott D. Anderson. This work is licensed under a [Creative Commons License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 

