$(document).ready(function() {
    $('.googleFeed > a').each(function(i, a){
        var feedUrl = encodeURIComponent(a.href);
        //var ajaxUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%20%3D%20'" + feedUrl + "'%0A&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
        var ajaxUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + feedUrl;
        console.log(ajaxUrl)
        $.getJSON(ajaxUrl, function(json){loadInto(rss2jsonToList(json), a);});
    });
    $('.flickrFeed > a').each(function(i, a){
        var ajaxUrl = a.href + "&format=json&jsoncallback=?";
        $.getJSON(ajaxUrl, function(json){loadInto(flickrJsonToList(json), a);});
    });
    $('.lastfmFeed > a').each(function(i, a){
        var ajaxUrl = a.href;
        $.getJSON(ajaxUrl, function(json){loadInto(lastfmJsonToList(json), a);});
    });
    $('.twitterFeed > a').each(function(i, a){
        var ajaxUrl = a.href + "&callback=?";
        $.getJSON(ajaxUrl, function(json){loadInto(twitterJsonToList(json), a);});
    });
    $('.zoteroFeed > a').each(function(i, a){
        var ajaxUrl = a.href;
        $.getJSON(ajaxUrl, function(json){loadInto(zoteroJsonToList(json), a);});
    });
})


function loadInto(newHtml, a) {
    div = a.parentNode;
    div.removeChild(a);
    div.innerHTML += newHtml;
}

function flickrJsonToList(json) {
  lst = json.items;
  // var newHtml = '<span class="header"><a href="' + doc.link + '">' + doc.title + '</a></span>';
  var newHtml = '<ul>';
  for (var i=0, post; i < 21, i < lst.length; i++) {
    post = lst[i];
    newHtml += '<li><a href="' + post.link + '"><img src="' + post.media.m.replace("_m", "_s") + '" title="' + post.title + '" class="img-polaroid"/></a></li>';
  }
  newHtml += '</ul>';
    return newHtml;
}

function googleJsonToList(json) {
  var feed = json.responseData.feed;
  // var newHtml = '<span class="header"><a href="' + feed.link + '">' + feed.title + '</a></span>';
  var newHtml = '<ul>';
  for (var i=0, entry; i < 20, i < feed.entries.length; i++) {
    entry = feed.entries[i];
    newHtml += '<li><a href="' + entry.link + '">' + entry.title + '</a> ' + prettyDate(entry.publishedDate) + '</li>';
  }
  newHtml += '</ul>';
    return newHtml;
}

function superfeedrJsonToList(json) {
  var feed = json;
  // var newHtml = '<span class="header"><a href="' + feed.link + '">' + feed.title + '</a></span>';
  var newHtml = '<ul>';
  for (var i=0, entry; i < 20, i < feed.items.length; i++) {
    entry = feed.items[i];
    newHtml += '<li><a href="' + entry.permalinkUrl + '">' + entry.title + '</a> ' + prettyDate(entry.published*1000) + '</li>';
  }
  newHtml += '</ul>';
    return newHtml;
}

function rss2jsonToList(json) {
  var feed = json.items;
  // var newHtml = '<span class="header"><a href="' + feed.link + '">' + feed.title + '</a></span>';
  var newHtml = '<ul>';
  for (var i=0, entry; i < 15 && i < feed.length; i++) {
    entry = feed[i];
    newHtml += '<li><a href="' + entry.link + '">' + entry.title + '</a> ' + prettyDate(entry.pubDate) + '</li>';
  }
  newHtml += '</ul>';
    return newHtml;
}

function yqlRssJsonToList(json) {
  var feed = json.query.results;
  // var newHtml = '<span class="header"><a href="' + feed.link + '">' + feed.title + '</a></span>';
  var newHtml = '<ul>';
  for (var i=0, entry; i < 15 && i < feed.item.length; i++) {
    entry = feed.item[i];
    newHtml += '<li><a href="' + entry.link + '">' + entry.title + '</a> ' + prettyDate(entry.pubDate) + '</li>';
  }
  newHtml += '</ul>';
    return newHtml;
}

function lastfmJsonToList(json) {
    var entries = json.recenttracks.track;
    var newHtml = '<ul>';
    var user = json.recenttracks["@attr"].user;
    for (var i=0, entry; i < 20 && i < entries.length; i++) {
        entry = entries[i];
        newHtml += '<li><a href="http://www.last.fm/user/' + user + '#' + entry.date.uts + '">' + entry.artist['#text'] + ' – ' + entry.name + '</a> ' + prettyDate(parseInt(entry.date.uts)*1000) + '</li>';
    }
    newHtml += '</ul>';
    return newHtml;
}

function twitterJsonToList(entries) {
    // var newHtml = '<span class="header"><a href="http://twitter.com/asterix77">Twitter</a></span>';
    var newHtml = '<ul>';
    for (var i=0, entry; i < 20, i < entries.length; i++) {
        entry = entries[i];
        newHtml += '<li><a href="http://twitter.com/asterix77/status/' + entry.id_str + '">' + entry.text + '</a> ' + prettyDate(entry.created_at) + '</li>';
    }
    newHtml += '</ul>';
    return newHtml;
}

function zoteroJsonToList(entries) {
    var newHtml = '<ul>';
    for (var i=0, entry; i < 20, i < entries.length; i++) {
        entry = entries[i];
        newHtml += '<li><a href="' + entry.links.alternate.href + '">'
            + entry.meta.creatorSummary
            + ' (' + entry.meta.parsedDate + '). '
            + '"' + entry.data.title + '"</a> '
            + prettyDate(entry.data.dateAdded) + '</li>';
    }
    newHtml += '</ul>';
    return newHtml;
}

/*
 * JavaScript Pretty Date
 * Copyright (c) 2011 John Resig (ejohn.org)
 * Licensed under the MIT and GPL licenses.
 */

// Takes an ISO time and returns a string representing how
// long ago the date represents.
function prettyDate(time){
        // Used to be (stopped working):
	// var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
	var date = new Date(time || ""),
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
		day_diff < 31 && Math.round( day_diff / 7 )==1 && "1 week ago" ||
		day_diff < 31 && Math.round( day_diff / 7 ) + " weeks ago" ||
                day_diff < 365 && Math.round( day_diff / 30 )==1 && "1 month ago" ||
                day_diff < 365 && Math.round( day_diff / 30 ) + " months ago" ||
                Math.round( day_diff / 365 )==1 && "1 year ago" ||
                Math.round( day_diff / 365 ) + " years ago";
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
