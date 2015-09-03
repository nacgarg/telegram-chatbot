var telegram = require('telegram-bot-api');
var pos = require('pos');
var fs = require('fs');
var markov = require('./markov');

var api = new telegram({
    token: fs.readFileSync('token.secret'),
    updates: {
        enabled: true
    }
});

api.on('message', function(message) {
    console.log(message);
    if (message.text) {
        if (message.text == '/reset') {
            data = {}
        } else if (message.text == '/data') {
            api.sendMessage({
                chat_id: message.chat.id,
                text: JSON.stringify(markov.getData(), null, 2)
            })
        } else if (message.text.slice(0, 6) === 'markov') {
            api.sendMessage({
                chat_id: message.chat.id,
                text: markov.respond(message.text.substring(6))
            });
            markov.learn(message.text.substring(6));
        } else {
            if (message.text) {
                markov.learn(message.text);
            }
        }
    }

});
