var END = "sidfj8j82j8";

var telegram = require('telegram-bot-api');
var pos = require('pos');
var fs = require('fs')

var api = new telegram({
        token: fs.readFileSync('token.secret'),
        updates: {
            enabled: true
    }
});

var data = {}

api.on('message', function(message) {
	console.log(message);
	if (message.text) {
    if (message.text == '/reset') {
    	data = {}
    }
    else if (message.text == '/data') {
    	api.sendMessage({chat_id: message.chat.id, text: JSON.stringify(data, null, 2)})
    }
    else if (message.text.slice(0, 6) === 'markov') {
    		learn(message.text.substring(6));
    		api.sendMessage({chat_id: message.chat.id, text: respond(message.text.substring(6))})
    }
    else {
    	if (message.text) {
    		learn(message.text);
    	}
    }}

});

var learn = function(message) {
	words = message.trim().split(/\s+/);
	words.forEach(function(word, i) {
		data[word] = data[word] || {};
		data[word][words[i+1] || END] = (data[word][words[i+1] || END] || 0) + 1;
	});
}

var generate = function(start) {
	var keys = Object.keys(data)
	start = start || keys[Math.floor(Math.random()*keys.length)];
	// var words = keys.map(function(key) { return data[key]; })
	// var total = 0
	
	return JENerateSentence(start, start);

}

var JENerateSentence = function(word, sentence) {
	if (!data[word]) {
		return "idk how to understand"
	}
	if (word === END) {
		console.log('END!!!')
		return sentence;
	}
	console.log("sentence: %s, word: %s", sentence, word);

	var keys = Object.keys(data[word]); // ['a', 'b']
	var total = 0
	// var total = keys.reduce(function (total, nextKey) {
	// 	console.log()
	// 	return total + data[word][nextKey];
	// });
	for (var i = 0; i < keys.length; i++) {
		total += data[word][keys[i]]
	};
	console.log('total=' + total);
	var threshold = Math.floor(Math.random()*total);
	console.log("threshold=" + threshold)
	var current = 1;
	for (var i = 1; i <= total; i++) {
		console.log("current: %s", current)
		if (current > threshold) {
			console.log(keys);
			console.log(i)
			console.log('picked word ' + keys[i-1])
			console.log('next recursion')
			if (keys[i-1] !== END) {
			return JENerateSentence(keys[i-1], sentence + " " + keys[i-1]); }
			else {
				return sentence;
			}
		}
		if (data[word][keys[i]]) {
			current += data[word][keys[i]]
		}
		else {
			return sentence;
		}
		
	};
	// return stacking(0, Math.floor(Math.random()*total), keys, 0, word, "Sentence.");
}

var stacking = function(current, threshold, keys, i, word, sentence){
	
	console.log('sentence: %s', sentence);
	console.log('iteration %s', i)
	console.log('CURRENT %s; threshold %s, keys: %s, thingyyy: %s', current, threshold, keys, keys[i]);
	if (current <= threshold) {
		console.log('returning stacking')
		return stacking(current + data[word][keys[i]], threshold, Object.keys(data[keys[i]]), i+1, sentence + keys[i]);
	}
	
	return sentence + keys[i];
};


var respond = function(message) {
var words = new pos.Lexer().lex(message);
			var tagger = new pos.Tagger();
			var taggedWords = tagger.tag(words);
			
			for (i in taggedWords) {
    			var taggedWord = taggedWords[i];
   				var word = taggedWord[0];
    			var tag = taggedWord[1];
    			if (tag === "NN" || tag === "NNS" || tag === "PRP" || tag === "NNP") {
    				return generate(taggedWord[0]);
    			}
			}
return generate(taggedWords[0][0]);
  		}