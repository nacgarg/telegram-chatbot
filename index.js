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
		if(message.from.first_name=="Lurf"){
		api.sendMessage({chat_id:message.chat.id,text:"lurf you are gibbon, not scrub"});
		return;
		}
if(message.from.first_name=="Nachi"){
                api.sendMessage({chat_id:message.chat.id,text:"fibbonachiketa you are TOTAL scrub"});
                return;
                }
            api.sendMessage({
                chat_id: message.chat.id,
                text: "Nice try, " + message.from.first_name + ", you filthy skrub."
            })
        } else if (message.text.slice(0, 6) === 'markov') {
            api.sendMessage({
                chat_id: message.chat.id,
                text: markov.respond(message.text.substring(6))
            });
        } else {
            markov.learn(message.text);
        }
    }

});
