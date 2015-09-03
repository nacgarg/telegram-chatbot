require('dotenv').load();

var telegram = require('telegram-bot-api');
var markov = require('./markov');

var api = new telegram({
    token: process.env.TELEGRAM_TOKEN,
    updates: {
        enabled: true
    }
});

api.on('message', function(message) {
    console.log(message);
    if (message.text) {
    	message.text = message.text.toLowerCase();
        if (message.text == '/data') {
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
            markov.learn(message.text);
        }
    }

});
