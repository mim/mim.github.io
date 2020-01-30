---
layout: reveal
title: JavaScript crash course
javascripts:
 - 02a-exercises.js
---
# {{ page.title }}
#### {{ site.author }}

Based on [CS 307 JS Crash course](https://cs.wellesley.edu/~cs307/readings/JavaScript-crash-course.html) which is copyright &copy; Scott D. Anderson and licensed under a [Creative Commons License](http://creativecommons.org/licenses/by-nc-sa/1.0/). 


## Plan

  * Go over basics of JavaScript
    * Variables, functions, conditionals, loops, data structures
    * Object-oriented concepts: using objects, classes, methods
  * Do some coding examples
  * Start going over HTML5 Canvas 2D drawing


## About JavaScript

  * Dynamic language widely supported by modern web browsers
  * Similar syntactically to Java
  * But semantically resembles Lisp and Python
    * weakly typed, has anonymous functions and closures
  * No connection to Java besides name

## The SCRIPT tag

  * Switch from HTML to JavaScript (JS) using the `script` tag
  * `src` attribute loads JS code  from another file or URL
  * if no `src` then JS code is between start and end `script` tags

Bare-bones skeleton of a web page using JS:
    
```html
<html>
  <head>
    ...
    <script src="yourcode.js"></script>
    ...
  </head>
  <body>
    <script>
       var num = 27;
       ...
    </script>
  </body>
</html>
```

## JavaScript syntax

  * `if` statements and `for` and `while` loops look just like Java
  * The following nested loops with conditionals print the prime numbers from 2 to `max`.
    
```javascript    
    var max = 50;
    var i,j;
    for ( i = 2 ; i < max ; i++ ) {
        // loop over possible factors up to sqrt of i
        j = 2;
        var prime = true;
        while ( prime && j*j <= i ) {
           if ( (i % j) == 0 ) {
               // console.log(j + " evenly divides " + i);
               prime = false;
           }
           j++;
       }
       if ( prime ) {
           console.log("prime: " + i);
       }                        
    }
```

### JavaScript syntax

  * Statements look like Java, ending in semi-colons.
    * They are technically optional, but that leads to lots of bugs
  * Both `// comment` and `/* comment */` work as comments.
    
```javascript    
    /* omit this dumb code
      var x = 3;  // magic number is 3
      var y = 7;  // another mystical number
    */
```
   
## Debugging

  * Built-in functions
    * `alert`: halts the program and pops up a window that must be acknowledged
    * `console.log`: writes its argument to a hidden window (JavaScript console)
  * To open the JavaScript console
    * In Google Chrome: `Command+Option+J` (Mac) or `Control+Shift+J` (Windows, Linux)
    * In Firefox: `Command+Shift+J` (Mac) or `Control+Shift+J` (Windows, Linux)

### Debugging: JavaScript Console

  * Open your JavaScript console
  * Copy the following code and paste it into the console
```javascript
    var x = 3;
    var y = 4;
    var sum = x + y;
    console.log("the values are " + x + " and " + y);
    alert("the sum is " + sum);
    console.log("they add up to " + sum);
```

  * Notice the difference between `alert()` and `console.log()`.
  * Note also that `alert()` stops the browser
    * rhe second call to `console.log()` doesn't happen until you click `OK` in the alert

## Datatypes

  * JavaScript has a few scalar datatypes:
    * strings (delimited by either single or double quotes) 
    * numbers, notated in the usual way 
    * booleans, notated by the bare words `true` and `false`.
  * The string concatenation operator is `+` (the plus sign)
    * but if both operands are numbers, adds them
    * not known until run-time due to dynamic typing
  * This illustrates an easy mistake to make:
```javascript
    var x = 3;
    var y = 4;
    alert("the sum is " + x + y);
```

### Compound Datatypes: Arrays

  * JavaScript has arrays, also called _lists_
```javascript
    // an array of some primes
    var primes = [2, 3, 5, 7, 11, 13];
    console.log("we currently have " + primes.length + " primes.");
    primes[6] = 17;   // add another
    primes.push(19);  // and another
    console.log(primes);
```

  * Arrays are zero-based and indexed by integers.
  * They support a number of [useful array methods](http://www.w3schools.com/js/js_array_methods.asp) as well.

### Compound Datatypes: Objects

  * In JavaScript, an "object" is a data structure of name-value pairs
  * Other languages call hashtables (Lisp, Java), associative arrays (PHP), dictionaries
(Smalltalk, Python), hashes (Perl), etc.
```javascript
    // an object representing a movie
    var movie1 = { title: "Dr. Zhivago",
                   director: "David Lean",
                   starring: ["Omar Sharif", "Julie Christie", "Geraldine Chaplin"],
                   release: 1965 }
    movie1.running_time = 197; // in minutes
    console.log("The title is " + movie1.title);
```

  * Note that values can be scalar or compound
    * e.g., an array literal of strings for the stars of the movie

### JSON

  * You can convert a JavaScript data structure into a string (for printing or sending/receiving over the web) using `JSON.stringify()`.
  * You can convert such a string back into the data structure using `JSON.parse()`.
```javascript    
    var movie1 = { title: "Dr. Zhivago",
                   director: "David Lean"};
    var movie_string = JSON.stringify(movie1);
    var movie_copy = JSON.parse(movie_string);
    if( movie1 != movie_copy ) {
        console.log("The copy is a different object from the original");
    }
    if( movie1.title == movie_copy.title && movie1.director == movie_copy.director ) {
        console.log("But they have the same title and director");
    }
```

  * This is called [_Serialization_](http://en.wikipedia.org/wiki/Serialization).
  * It's so nice and compact that it is now a common representations of web data, called [JSON](http://json.org) or JavaScript Object Notation.

## Variables and Scope

  * In JS, variables don't have types; data does.
  * So a variable can store any type of data, and you don't have to declare the datatype.
  * This is allowed:
```javascript
    var x = "five"; // a string
    x = 5;     // a number
    x = true;  // a boolean
    x = [2,3]; // an array
    x = {a: 2, b: 3};  // an object
```

  * But really it's a bad idea
    * Anyone reading your code will not know what kind of data is stored in `x`


### Naming ([one of two hard things in computer science](https://twitter.com/secretGeek/status/7269997868?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E7269997868&ref_url=https%3A%2F%2Fmartinfowler.com%2Fbliki%2FTwoHardThings.html))

  * What is this variable for?
```javascript    
    var students;
```

  * Could be
```javascript
    students = 3;   // maybe numStudents is better?
    students = ["alice", "bob", "charlie" ];  // maybe studentList?
    students = "alice, bob, and charlie";
```

  * Since the datatype isn't there, use better names: `numStudents`, `studentNameList`, `formattedStudentNames`
    * See [Google JavaScript Style Guide](https://google.github.io/styleguide/javascriptguide.xml)
  * When creating a variable, you can declare it using `var`
    * Optional, but you should do it
  * Do _not_ use `var` if you are re-assigning to an existing variable.

## Functions

  * Functions have a simple syntax:
```javascript    
    function add5(x) {
        return x + 5;
    }
    console.log("the result is " + add5(2));  
```

  * In general:
```javascript    
    function nameOfFunction(arg1, arg2, arg3, arg4) {
        // body
        return ans;   // optional
    }
```

  * JavaScript does not check that a function is invoked with the right number of
arguments
    * Common cause of errors


### Local Variables

  * Variables declared inside of functions will mask global variables of the same name
```javascript    
    var x = 5;  // global named x
    function addToGlobalx(y) {
        x++;           // increments global x
        return y + x;  // refers to global x
    }
    function addToLocalx(y) {
        var x = 2;     // new local named x
        x++;           // increments local x
        return y + x;  // refers to local X
    }
    // global x keeps increasing
    console.log(addToGlobalx(3));  // 9
    console.log(addToGlobalx(3));  // 10
    // but local x is always 2
    console.log(addToLocalx(3));   // 6
    console.log(addToLocalx(3));   // 6
```

  * (There are other scopes, such as closures, but we will not use them much)


### Anonymous Functions

  * You can also have an _anonymous_ function
  * You can store it in a variable, so it acts like a regular function
```javascript    
    var add4 = function (x) { return x + 4; };
    console.log("the result is " + add4(3));  
```

  * Nearly the same as
```javascript    
    function add5(x) {
        return x + 5;
    }
```

  * The [TW](../libs/tw.js) library uses anonymous functions
    * but you probably won't need to write your own for this class


### Functions as First Class Objects

  * In Javascript, functions are _First-class objects_, meaning they
    * can be stored in a variable. (We saw that with `add4`.) 
    * can be passed as an argument to a function or method. 
    * can later be invoked, when desired.
  * For example
```javascript
    var five = function () { return 5; };
    var next = function (curr) { return 1 + curr(); };
    var ans = next(five);
    alert("the answer is " + ans);
```

  * To call the function, use parens: `five()`
  * To refer to the function, don't: `five`


### Functions with Keyword Arguments

  * Functions with lots of arguments can be inconvenient:
```javascript
    glFrustum(-2,2,1,-1,1,10);
```

  * JavaScript doesn't have named arguments, but it fakes it using objects:
```javascript
    /* returns the volume of a box with the given dimensions, 'width,'
       'height,' and 'depth.' */
    
    function boxVolume(dims) {
        return dims.width * dims.height * dims.depth;
    }
    
    console.log(boxVolume( {width: 2, height: 10, depth: 3} ));
```

  * Note the curly braces around the object literal
    * and the whole literal is the `dims` parameter of the function


## Using Objects

  * JavaScript doesn't really have _classes_ the way that Java and C++ do 
    * But it can be implemented and often is, e.g., by Three.js
  * To create an instance of an object, use the `new` keyword
```javascript    
      var box = new THREE.BoxGeometry(w,h,d);
```
  * To invoke a method on an object, use the `.` operator
```javascript    
    objvar.method(arg1,arg2,...);
```
    
### Investigating objects

  * How can you find out what methods an object supports?
  * Reading the documentation
  * Use the JavaScript debugger
    * Type the variable name and then `.` and a menu of possibilities will appear
  * What methods do these objects support?
```javascript    
    var a_string = "JavaScript is fun";
    var a_list = ["and", "also", "useful"];
    var a_date = new Date();
```

## Summary

  * JavaScript syntax looks a lot like Java
  * The console is your friend, use it
  * Data has a type, variables do not
  * Functions are first-class objects
  * Objects look like Java objects
