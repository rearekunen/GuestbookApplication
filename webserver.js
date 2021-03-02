var express = require('express');
var app = express();
app.use(express.static(__dirname));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/frontpage.html');
});

app.get('/guestbook', function (req, res) {
    var data = require('./messages.json');
    var results = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">' +
    '<link href="styles.css" rel="stylesheet" type="text/css">' +
    '<h1>Guestbook</h1>' +
    '<nav class="navbar navbar-expand-lg navbar-light bg-light">' +
        '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">' +
          '<span class="navbar-toggler-icon"></span>' +
        '</button>' +
        '<div class="collapse navbar-collapse" id="navbarNavAltMarkup">' +
          '<div class="navbar-nav">' +
            '<a class="nav-item nav-link" href="/">Homepage</a>' +
            '<a class="nav-item nav-link" href="/newmessage">Write a message</a>' +
            '<a class="nav-item nav-link active" href="/guestbook">View messages</a>' +
          '</div>' +
        '</div>' +
      '</nav>' +
    '<div class="container bg-light content"><table class="table">' +
    '<tr>' +
    '<th>ID</th>' + 
    '<th>Name</th>' +
    '<th>Country</th>' +
    '<th>Message</th>' +
    '</tr>';

    for (var i=0; i < data.length; i++) {
        results +=
        '<tr>' +
        '<td>' + data[i].id + '</td>' +
        '<td>' + data[i].username + '</td>' +
        '<td>' + data[i].country + '</td>' +
        '<td>' + data[i].message + '</td>' +
        '</tr>';
    }

    results += '</table></div>';

    res.send(results);
});

app.get('/newmessage', function (req, res) {
    res.sendFile(__dirname + '/newmessage.html');
});

app.post('/newmessage', function (req, res) {
    var data = require('./messages.json');
    var fs = require('fs');

    data.push({
        "id" : parseInt(data[data.length - 1].id) + 1,
        "username" : req.body.username,
        "country"  : req.body.country,
        "date" : new Date(),
        "message" : req.body.message
    });

    var jsonStr = JSON.stringify(data);

    fs.writeFile('messages.json', jsonStr, (err) => {
        if (err) throw err;
        console.log("Message saved.");
    });

    res.sendFile(__dirname + '/thankyoupage.html');
});

app.get('/ajaxmessage', function (req, res) {
    res.sendFile(__dirname + '/ajaxmessage.html');
});

app.post("/ajaxmessage", function(req, res) {
    var data = require('./messages.json');
    var fs = require('fs');
    var name = req.body.name;
    var country = req.body.country;
    var message = req.body.message;

    data.push({
        "id" : parseInt(data[data.length - 1].id) + 1,
        "username" : name,
        "country"  : country,
        "date" : new Date(),
        "message" : message
    });

    var jsonStr = JSON.stringify(data);

    fs.writeFile('messages.json', jsonStr, (err) => {
        if (err) throw err;
        console.log("Message saved.");
    });

    var results =' <table class="table">' +
    '<tr>' +
    '<th>ID</th>' + 
    '<th>Name</th>' +
    '<th>Country</th>' +
    '<th>Message</th>' +
    '</tr>';

    for (var i=0; i < data.length; i++) {
        results +=
        '<tr>' +
        '<td>' + data[i].id + '</td>' +
        '<td>' + data[i].username + '</td>' +
        '<td>' + data[i].country + '</td>' +
        '<td>' + data[i].message + '</td>' +
        '</tr>';
    }

    results += '</table></div>';

    res.send(results);
  });

app.listen(8081, function () {
    console.log('Listening on port 8081!')
});