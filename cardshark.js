var express = require('express');
var http = require('http');
var fs = require('fs');

var app = express();

app.use(express.static(__dirname + '/'));

app.get('/jql', function(req, res){
	console.log('incomming query \n\n\n' + JSON.stringify(req.query));
    var user = req.query.username;
    var password = req.query.password;

	var jiraSearchUrl = '/rest/api/2/search/';
	var jql = encodeURIComponent(req.query.jql);
	var options = {
	  host: 'dev-jira',
	  auth: user + ':' + password,
	  path : jiraSearchUrl + '?jql=' + jql
	};


	var callback = function(response) {
	  var str = '';
	  //another chunk of data has been recieved, so append it to `str`
	  response.on('data', function (chunk) {
		str += chunk;
	  });
	  //the whole response has been recieved, so we just print it out here
	  response.on('end', function () {
	  	console.log(str);
		fs.writeFile('./JQL result ' + new Date().getTime() + '.json', JSON.stringify(JSON.parse(str), undefined, 2), function(err) {
	    if(err) {
			        console.log(err);
			    } else {
			        console.log("report was saved!");
			    }
			});
		});
	}

	//fetch the issues
	console.log('requesting issues: ' + jql);
	http.request(options, callback).end();
});

var server = app.listen(9000, function() {
    console.log('Listening on port %d', server.address().port);
});