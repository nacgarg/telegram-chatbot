var END = "18fb21-t92ddb";

var data = {};
var fs = require('fs');
var pos = require('pos');
if (fs.existsSync('data.json')) {
    data = JSON.parse(fs.readFileSync('data.json'));
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
    var threshold = Math.floor(Math.random() * total);
    console.log("threshold=" + threshold)
    var current = 1;
    for (var i = 1; i <= total; i++) {
        console.log("current: %s", current)
        if (current > threshold) {
            console.log(keys);
            console.log(i)
            console.log('picked word ' + keys[i - 1])
            console.log('next recursion')
            if (keys[i - 1] !== END) {
                return JENerateSentence(keys[i - 1], sentence + " " + keys[i - 1]);
            } else {
                return sentence;
            }
        }
        if (data[word][keys[i]]) {
            current += data[word][keys[i]]
        } else {
            return sentence;
        }

    };
}

var generate = function(start) {
    var keys = Object.keys(data)
    start = start || keys[Math.floor(Math.random() * keys.length)];
    return JENerateSentence(start, start);
}

module.exports = {
    learn: function(message) {
        words = message.trim().split(/\s+/);
        words.forEach(function(word, i) {
            data[word] = data[word] || {};
            data[word][words[i + 1] || END] = (data[word][words[i + 1] || END] || 0) + 1;
        });
    },
    respond: function(message) {
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
        return generate(words[0]);
    },
    getData: function() {
    	return data;
    }
}

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    fs.writeFile('data.json', JSON.stringify(data, null, 4), function(err) {
        if (err) {
            console.log(err);
        } else {
            process.exit();
        }
    });
});
