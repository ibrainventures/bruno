// Json, will get moved to a file later.
var json = [
    {
        'bubble': 'bubbleRight',
        'delay': 200,
        'typing': 100,
        'contents': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque voluptatum consequatur, dicta magnam quis ipsa error quod eveniet odio quo, expedita numquam odit, voluptatem. Necessitatibus beatae, enim similique quos! Excepturi.'
    },
    {
        'bubble': 'bubbleLeft',
        'delay': 200,
        'typing': 100,
        'contents': 'Sorry, I don\'t speak Spanish. 😱'
    },
    {
        'bubble': 'bubbleLeft',
        'delay': 1000,
        'typing': 2000,
        'contents': 'Oh, wait.'
    },
    {
        'bubble': 'bubbleLeft',
        'delay': 200,
        'typing': 100,
        'contents': 'Is that the placeholder psudo-latin designers use? 🤓'
    },
    {
        'bubble': 'bubbleRight',
        'delay': 200,
        'typing': 100,
        'contents': 'You got it. 👌'
    },
    {
        'bubble': 'bubbleRight',
        'delay': 200,
        'typing': 100,
        'contents': 'How does a hash sound for dinner by the way?'
    },
    {
        'bubble': 'bubbleRightImg',
        'delay': 200,
        'typing': 100,
        'contents': 'hash.jpg'
    },
    {
        'bubble': 'bubbleLeft',
        'delay': 200,
        'typing': 100,
        'contents': 'That looks amazing.'
    },
    {
        'bubble': 'bubbleRight',
        'delay': 200,
        'typing': 100,
        'contents': 'I know right?'
    },
    {
        'bubble': 'bubbleLeft',
        'delay': 200,
        'typing': 100,
        'contents': 'More tasty noms pls. 😻'
    },
    {
        'bubble': 'bubbleRight',
        'delay': 200,
        'typing': 100,
        'contents': 'Hey wait.'
    },
    {
        'bubble': 'bubbleRight',
        'delay': 200,
        'typing': 100,
        'contents': 'Why are you called "Bruno"?'
    },
    {
        'bubble': 'bubbleLeft',
        'delay': 200,
        'typing': 100,
        'contents': 'It\'s a Ms. Marvel reference. Bruno is her nerdy best friend.'
    },
    {
        'bubble': 'bubbleLeftImg',
        'delay': 200,
        'typing': 100,
        'contents': 'bruno.png'
    },
    {
        'bubble': 'bubbleLeft',
        'delay': 200,
        'typing': 100,
        'contents': 'Am I your nerdy best friend?'
    },
    {
        'bubble': 'bubbleRight',
        'delay': 200,
        'typing': 100,
        'contents': 'Sure.'
    },
    {
        'bubble': 'bubbleLeft',
        'delay': 200,
        'typing': 100,
        'contents': '😎'
    }
];

// Appends and removes a left typing bubble indicator to the provided id. 'typing' represents how long in ms the bubble stays on screen.
// returns a promise
var bubbleTyping = function(id, typing) {
    return new Promise(function(resolve, reject) {
        $('> .bubbleLeftContainer', id).last().append("<div class=\"bubble bubbleLeft bubbleLeftAnimate bubbleTyping\"><span class=\"typing\"><span class=\"circle dot1\"></span><span class=\"circle dot2\"></span><span class=\"circle dot3\"></span></span></div>").one('animationend', function() {
            setTimeout (function() {
                $('> .bubbleLeftContainer > .bubbleTyping', id).last().addClass("bubbleLeftAnimateExit").one('animationend', function() {
                    $('> .bubbleLeftContainer', id).css("min-height", function(){ return $(this).height(); });
                    $('> .bubbleLeftContainer > .bubbleTyping', id).last().remove();
                    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
                    resolve();
                });
            }, typing);
        });
    });
};

// Appends a left or right bubble to the provided id. Returns a promise.
// Takes a single json message as an argument.
bubble = function(id, value) {
    return new Promise(function(resolve, reject) {
        var message;

        // Construct the bubble's div based on whether or not it is an image.
        if(value.bubble === 'bubbleLeft' || value.bubble === 'bubbleRight') {
            message = "<div class=\"bubble " + value.bubble + " " + value.bubble + "Animate\">" + value.contents + "</div>";
        }
        else if(value.bubble === 'bubbleLeftImg' || value.bubble === 'bubbleRightImg') {
            message = "<div class=\"bubble " + value.bubble + " " + value.bubble.substring(0,value.bubble.length-3) + "Animate\">" + "<img src=\"assets/img/" + value.contents + "\" alt=\"image\">" + "</div>";
        }

        // If the bubble is on the left, call bubbleTyping to provide the typing indicator.
        if(value.bubble === 'bubbleLeft' || value.bubble === 'bubbleLeftImg') {
            $(id).append("<div class=\"bubbleLeftContainer\"></div>");
            bubbleTyping(id, value.typing).then(function() {
                // setTimeout pauses before posting the bubble based off the delay variable.
                setTimeout (function() {
                    $('> .bubbleLeftContainer', id).last().append(message).one('animationend', function() {
                        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
                        resolve();
                    });
                }, value.delay);
            });
        }
        // If the bubble is on the right, immediately post.
        else if(value.bubble === 'bubbleRight' || value.bubble === 'bubbleRightImg') {
            // setTimeout pauses before posting the bubble based off the delay variable.
            setTimeout (function() {
                $(id).append(message).one('animationend', function() {
                    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
                    resolve();
                });
            }, value.delay);
        }
        // Otherwise, reject the promise.
        else {
            reject(Error("Something went wrong!"));
        }
    });
};

// Posts a set of json messages as bubbles to the provided id.
// Returns a promise.
var display = function(id, data) {
    return new Promise(function(resolve, reject) {
        var sequence = Promise.resolve();
        data.forEach(function(value) {
            sequence = sequence.then(function() {
                return bubble(id, value);
            });
        })
    });
};

$(document).ready(function() {
    // TODO: Read json from a file.
    display('#bruno-chat', json);
});
