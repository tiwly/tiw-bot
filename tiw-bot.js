var express = require('express')
var app = express()
var token = "CAAOvJWRjvZAwBAKzv9egmvEVwf0dGN6CiCZA6bcSybChtDUnm8Kr8Sgpw0DwaZADHZCXnjaWZAO4X2pjpDfmwxGZBvO7mExVYuLUD8M2ebGIiDK2pxuymRrU5d78vSPA1WZC9rSrtmnUKyaxZC2oKaLi00yNPjoIQWcrSakloKKBqqZAMLhBtwiRFI8WLAJGgJ8fX8kn7D6ybywZDZD";
var request = require('request')
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === '1234') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong validation token')
})

app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging;
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i];
    var sender = event.sender.id;
    if (event.message && event.message.text) {
    	var text = event.message.text;
    	// Handle a text message from this sender
    	console.log(text);
    	sendTextMessage(sender,text);
    }
  }
  res.sendStatus(200);
});

app.set('port', (process.env.PORT || 5000))

app.listen(app.get('port'), function () {
  console.log('Example aoo listening on port ' + app.get('port') + ' !')
})

function sendTextMessage(sender, text) {
  var messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}