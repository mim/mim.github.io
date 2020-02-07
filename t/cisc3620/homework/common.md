---
layout: default
title: Instructions common to all homeworks
javascripts:
  - //code.jquery.com/jquery-3.0.0.min.js
  - ../libs/dat.gui.min.js
  - ../libs/three.min.js
  - ../libs/tw.js
  - ../libs/OrbitControls.js
  - https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML
  - ../js/google-code-prettify/prettify.js
  - ../js/custom.js
  - ../js/307.js
  - ../js/activities.js
---
# Instructions common to all homeworks

## Collaboration

As per the syllabus, you can discuss the problem with classmates at a high level, but you can't share code. All work turned in must be strictly your own. Also don't reverse-engineer my solutions (even though they are obfuscated).


## Documentation

You should document what isn't obvious from the code. That usually means
saying not what something does, but why it's there and how it fits into the
overall program. Line by line documentation is not necessary, but certainly
every function needs some explanation.

Try to put yourself in my shoes, or the shoes of someone reading your code who
doesn't know what the program is supposed to do or how it's supposed to work.

For identification purposes, every program must have the author's name and the assignment name or number at the top.

Note that I have deliberately not demonstrated good documentation in the
example programs because we will study them to determine what they do and how
they work. You are encouraged to document your own copy as a way to help your
understanding.

## Turnin

All work should be turned in via the appropriate dropbox on blackboard.

Programming problems will be turned in by submitting the URL of your codepen. Do not change your code after the deadline.

Non-programming problems should be turned in as documents (word, PDF, etc).  If you want to draw something by hand, take a picture of it and submit the picture. Apps like [Adobe Scan](https://acrobat.adobe.com/us/en/mobile/scanner-app.html) will make a reasonable approximation of a scan from a photo and generate a PDF.

## Deadlines and Lateness

All homeworks should be turned in via blackboard at least 30 minutes prior to the beginning of the corresponding class period. Homeworks turned in late will be penalized 10% for each day or fraction of a day they are late.  For example, an assignment that is turned in one day and one hour after the deadline and would have received a 90% will instead receive an 70% since it is more than one day late.

## Coding Style

Computer programs are not solely about getting stuff to work. They are largely
about that, but not solely. It's also important for them to be clear and
readable, because no one will want to use your code if they don't feel they
can understand and maintain it.

JavaScript coding style is not that different from Java or Python style, and
there is room for alternative styles. 

For now, let the following list of rules and guidelines suffice:

  1. Don't explain the obvious. What counts as obvious depends on your audience, but don't think about _me_ as your audience, but rather another student in our class. She understands the basics of the language and the course, just as you do, but she won't understand your thinking about the program and the way you went about coding it. 
  2. All names (functions, methods, variables, modules, etc) should be _descriptive_ and _accurate_. You'd be surprised at how often I have read code where the name may have been descriptive when the code was first written, but subsequent editing has rendered the name obsolete and misleading. 
  3. Be consistent with capitalization and punctuation. I recommend going with [Google's JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html) that might be good to skim.  Generally, their [Naming Rule](https://google.github.io/styleguide/jsguide.html#naming) is to use camelCase with a lowercase initial, except for classes. You should do the same. 
  4. Functions should do just one thing (suitably defined). A function that adds a tree to the scene is good. A function that adds two trees to the scene is bad (what if the user wants three trees?). A function that adds _all_ the trees to the scene is also good, even if the number of trees in the scene is two. 
  5. Indentation is important. Code must be properly indented to show the syntactic structure of the program. Codepen will do this for you if you click on the `v` menu for the JavaScript pane and select "Format JavaScript". 
  6. A statement that belongs to (is part of) another statement should be indented relative to the containing statement. Statements that are at the same level in the syntax tree should be indented the same amount. 
  7. Document the program as a whole. What does it do, and what are its inputs and outputs. Say who wrote it, and when. This is typically written as a block comment at the top of the file. 
  8. Document functions. Each function should be preceded by a brief paragraph explaining what it does, how it works (if necessary) and the meaning of its arguments and return values. 
  9. Document variables and data members. Explain the purpose and use of the data and any non-obvious aspects of its implementation. 
  10. Document any code that is not obvious. 
  11. Use proper spelling and grammar, except when brevity is more important. 
  12. Remember that screens and printers have finite width. Stick to an 80-character line. 
  13. Avoid redundancy and code repetition by looking for suitable opportunities for abstraction via functions, methods, modules, and the like. 

Good coding avoids _redundancy_ and unnecessary _duplication_ of
code. This is sometimes known as the [Don't Repeat Yourself
(DRY)](http://en.wikipedia.org/wiki/Don't_repeat_yourself) principle. While it
can obviously be overdone, avoiding repetition means:

  * Code only has to be debugged in the one place it's defined, not in all the copies, and 
  * Updates to the one copy of the code propagate to all the places its used. 

For example, if you often need to _zark_ some data, defining a function to
zark the data and invoking it whenever necessary means that you can debug the
`zark` function once, and if the requirements of the _zark_ operation change,
you can update the one function to effect the change. So, we'll add one more
rule: Avoid redundancy!
