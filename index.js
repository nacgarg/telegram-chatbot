require('dotenv').load();

var TelegramBot = require('node-telegram-bot-api');
var markov = require('./markov');


var bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
    polling: {
        interval: 1,
        timeout: 4
    }

});

bot.onText(/^\/markov(?:@Markov_ChatBot)? (.*)$/, function (msg, match) {
    console.log("recieved");
    var fromId = msg.chat.id;
    bot.sendMessage(fromId, markov.respond(match[1]), {
        parse_mode: 'markdown'
    });
});

bot.on('message', function (msg) {
    var fromId = msg.chat.id;
    if (msg.text && msg.text.indexOf('/markov') === -1) {
        markov.learn(msg.text);
    }
});
