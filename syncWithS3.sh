#!/bin/bash -xue

# Sync files with amazon s3 bucket using aws command line tool

BUCKET=www.mr-pc.org
DIR=~/code/www/

aws s3 sync $DIR s3://$BUCKET/ --exclude .git/\* --exclude .gitignore --exclude bib2html.sh --exclude syncWithUnison --exclude syncWithS3.sh
aws s3 cp ~/doc/cv/cv.pdf s3://$BUCKET/ --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers
