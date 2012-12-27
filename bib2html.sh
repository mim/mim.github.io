#!/bin/bash -xue

# Convert all of the .aux files generated by my cv to a single
# sectioned html page.

AUXS=(1 2 3 4)
FILES=(chapter journal conference workshop)
NAMES=("Book chapter" "Journal" "Conference" "Other")

AUXDIR=~/doc/cv
ALLHTML=pubs.html
ALLBIBHTML=pubs_bib.html
ALLABSHTML=pubs_abs.html
HTMLDIR=~/html

for file in $ALLHTML $ALLABSHTML ; do
    cat > $file <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Michael I Mandel's Publications</title>
<link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
<link href="css/feeds.css" rel="stylesheet" media="screen">
<link href="http://fonts.googleapis.com/css?family=Droid+Serif|Droid+Sans" rel="stylesheet" type="text/css">
</head>
<body>

<div class="container">

<div class="row">
<div class="span12">
<div class="box">

<div class="navbar overview">
  <div class="navbar-inner">
    <ul class="nav">
      <li><a href="index.html">Home</a></li>
      <li><a href="http://mr-pc.org/cv.pdf">CV</a></li>
      <li><a href="research.html">Research</a></li>
      <li class="active"><a href="pubs.html">Publications</a></li>
    </ul>
    <ul class="nav pull-right">
      <li><a href="mailto:mim@mr-pc.org">mim@mr-pc.org</a></li>
    </ul>
  </div>
</div>

<div class="row">
<div class="span10 offset1">

<div class="page-header">
<h1>Publications</h1>
</div>
EOF
done

cat > $ALLBIBHTML <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>BibTeX for Michael I Mandel's Publications</title>
<link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
<link href="css/feeds.css" rel="stylesheet" media="screen">
<link href="http://fonts.googleapis.com/css?family=Droid+Serif|Droid+Sans" rel="stylesheet" type="text/css">
</head>
<body>

<div class="container">

<div class="row">
<div class="span12">
<div class="box">

<div class="navbar overview">
  <div class="navbar-inner">
    <ul class="nav">
      <li><a href="index.html">Home</a></li>
      <li><a href="http://mr-pc.org/cv.pdf">CV</a></li>
      <li><a href="research.html">Research</a></li>
      <li class="active"><a href="pubs.html">Publications</a></li>
    </ul>
    <ul class="nav pull-right">
      <li><a href="mailto:mim@mr-pc.org">mim@mr-pc.org</a></li>
    </ul>
  </div>
</div>

<div class="row">
<div class="span10 offset1">

<div class="page-header">
<h1>Publications</h1>
</div>
EOF

for n in `seq ${#AUXS[@]}` ; do 
    AUX=${AUXS[$n-1]}
    NAME=${NAMES[$n-1]}
    FILE=${FILES[$n-1]}

    BIB="mandel_${FILE}.bib"
    HTML="mandel_${FILE}.html"
    BIBHTML="mandel_${FILE}_bib.html"
    ABSHTML="mandel_${FILE}_abstracts.html"

    ( cd $AUXDIR ; aux2bib bu$AUX.aux | grep -v \@comment ) > $BIB
    bibtex2html --both -nf poster Poster -nf slides Slides -nf http http $BIB

    # Strip off headers and footers
    for file in $HTML $ABSHTML ; do
        sed -i "0,/<table>/d" $file
        sed -i "\|</table>|,+22d" $file
        sed -i "s/$BIBHTML/$ALLBIBHTML/" $file
        sed -i "s/$ABSHTML/$ALLABSHTML/" $file
    done
    
    echo -e "<h2>$NAME</h2>\n<table>\n" >> $ALLHTML
    cat $HTML >> $ALLHTML
    echo -e "</table>\n" >> $ALLHTML

    echo -e "<h2>$NAME</h2>\n<table>\n" >> $ALLABSHTML
    cat $ABSHTML >> $ALLABSHTML
    echo -e "</table>\n" >> $ALLABSHTML

    # Strip off headers and footers of bib html files
    sed -i "0,/<body>/d" $BIBHTML
    sed -i "\|<hr><p><em>|,+22d" $BIBHTML
    sed -i "s/$BIB/$NAME/" $BIBHTML
    cat $BIBHTML >> $ALLBIBHTML

    rm $BIB
    rm $HTML
    rm $BIBHTML
    rm $ABSHTML
done

for file in $ALLHTML $ALLABSHTML $ALLBIBHTML ; do
    cat >> $file <<EOF

</div>
</div>
</div>
</div>
</div>
</div>

<script src="http://www.google-analytics.com/urchin.js"
  type="text/javascript">
</script>
<script type="text/javascript">
_uacct = "UA-2220648-1";
urchinTracker();
</script>
</body>
</html>
EOF
done

mv $ALLHTML $ALLBIBHTML $ALLABSHTML $HTMLDIR
