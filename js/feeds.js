$(document).ready(function() {
    $('.googleFeed > a').each(function(i, a){
        var feedUrl = encodeURIComponent(a.href);
        var ajaxUrl = "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=" + feedUrl + "&v=1.0&num=12&callback=?";
        $.getJSON(ajaxUrl, function(doc){jsonLoadGoogleFeedInto(doc, a);});
    });
    $('.flickrFeed > a').each(function(i, a){
        var ajaxUrl = a.href + "&format=json&jsoncallback=?";
        $.getJSON(ajaxUrl, function(doc){jsonLoadFlickrInto(doc, a);});
    });
    $('.twitterFeed > a').each(function(i, a){
        var ajaxUrl = a.href + "&callback=?";
        $.getJSON(ajaxUrl, function(doc){jsonLoadTwitterInto(doc, a);});
    });
})


function jsonLoadFlickrInto(doc, a) {
  lst = doc.items;
  var newHtml = '<span class="header"><a href="' + doc.link + '">' + doc.title + '</a></span>';
  newHtml += '<ul>';
  for (var i=0, post; i < 21, i < lst.length; i++) {
    post = lst[i];
    newHtml += '<li><a href="' + post.link + '"><img src="' + post.media.m.replace("_m", "_s") + '" title="' + post.title + '"/></a></li>';
  }
  newHtml += '</ul>';
  div = a.parentNode;
  div.removeChild(a);
  div.innerHTML += newHtml;
}

function jsonLoadGoogleFeedInto(doc, a) {
  feed = doc.responseData.feed;
  var newHtml = '<span class="header"><a href="' + feed.link + '">' + feed.title + '</a></span>';
  newHtml += '<ul>';
  for (var i=0, entry; i < 20, i < feed.entries.length; i++) {
    entry = feed.entries[i];
    newHtml += '<li><a href="' + entry.link + '">' + entry.title + '</a> ' + prettyDate(entry.publishedDate) + '</li>';
  }
  newHtml += '</ul>';
  div = a.parentNode;
  div.removeChild(a);
  div.innerHTML += newHtml;
}

function jsonLoadTwitterInto(doc, a) {
    entries = doc;
    var newHtml = '<span class="header"><a href="http://twitter.com/asterix77">Twitter</a></span>';
    newHtml += '<ul>';
    for (var i=0, entry; i < 20, i < entries.length; i++) {
        entry = entries[i];
        newHtml += '<li><a href="http://twitter.com/asterix77/status/' + entry.id_str + '">' + entry.text + '</a> ' + prettyDate(entry.created_at) + '</li>';
    }
    newHtml += '</ul>';
    div = a.parentNode;
    div.removeChild(a);
    div.innerHTML += newHtml;
}

/*
 * JavaScript Pretty Date
 * Copyright (c) 2011 John Resig (ejohn.org)
 * Licensed under the MIT and GPL licenses.
 */

// Takes an ISO time and returns a string representing how
// long ago the date represents.
function prettyDate(time){
	var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);
			
	if ( isNaN(day_diff) || day_diff < 0 )
		return;
			
	return day_diff == 0 && (
			diff < 60 && "just now" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
		day_diff == 1 && "Yesterday" ||
		day_diff < 7 && day_diff + " days ago" ||
		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago" ||
                day_diff < 365 && Math.ceil( day_diff / 30 ) + " months ago" ||
                Math.ceil( day_diff / 365 ) + " years ago";
}

// If jQuery is included in the page, adds a jQuery plugin to handle it as well
if ( typeof jQuery != "undefined" )
	jQuery.fn.prettyDate = function(){
		return this.each(function(){
			var date = prettyDate(this.title);
			if ( date )
				jQuery(this).text( date );
		});
	};
