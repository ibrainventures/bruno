// Appends and removes a left typing bubble indicator to the provided id.
// 'typing' represents how long in ms the bubble stays on screen.
// Returns a Promise.
var bubbleTyping = function(id, typing) {
    return new Promise(function(resolve, reject) {
        $('> .bubble-left-container', id).last().append("<div class=\"bubble bubble-left bubble-left-animate bubble-typing\"><span class=\"typing\"><span class=\"circle dot1\"></span><span class=\"circle dot2\"></span><span class=\"circle dot3\"></span></span></div>").one('animationend', function() {
            setTimeout (function() {
                $('> .bubble-left-container > .bubble-typing', id).last().addClass("bubble-left-animate-exit").one('animationend', function() {
                    $('> .bubble-left-container', id).css("min-height", function(){ return $(this).height(); });
                    $('> .bubble-left-container > .bubble-typing', id).last().remove();
                    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
                    resolve();
                });
            }, typing);
        });
    });
};

// Appends a left or right bubble to the provided id.
// Takes a single json message as an argument.
// Returns a Promise.
var bubble = function(id, value) {
    return new Promise(function(resolve, reject) {
        var message;

        // Construct the bubble's div based on whether or not it is an image.
        if(value.bubble === 'bubble-left' || value.bubble === 'bubble-right' || value.bubble === 'bubble-disconnected') {
            if(value.link) {
                //message = "<a class=\"bubble-link-container\" href=\"" + value.link + "\"><div class=\"bubble " + value.bubble + " " + value.bubble + "-animate\">" + value.contents + "</div>";
                //message = message + '<div class="bubble-link-icon bubble-left-animate pull-left"><span class="glyphicon glyphicon-link" aria-hidden="true"></span> 〉</div></a><div class="clearfix"></div>';
                //message = message + '<a class=\"bubble-link-container bubble-left-animate\" href=\"' + value.link + '\"><div class="bubble-link-text pull-left">' + 'shutupandsitdown.com' + '</div></a>';
                var parser = document.createElement('a');
                parser.href = value.link;
                var linkText = parser.hostname;
                if(linkText.slice(0,4) === 'www.') {
                    linkText = linkText.slice(4);
                }
                message = '<a class="bubble-link" target="_blank" href="' + value.link + '"><div class="bubble-column"><div class="bubble ' + value.bubble + ' ' + value.bubble + '-animate bubble-link-item">' + value.contents + '</div>';
                message = message + '<div class="bubble-link-icon bubble-left-animate"><span class="glyphicon glyphicon-link" aria-hidden="true"></span><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></div></div>';
                message = message + '<div class="bubble-link-text bubble-left-animate">' + linkText + '</div></a>';
            }
            else {
                message = "<div class=\"bubble " + value.bubble + " " + value.bubble + "-animate\">" + value.contents + "</div>";
            }
        }
        else if(value.bubble === 'bubble-left-img' || value.bubble === 'bubble-right-img') {
            message = "<div class=\"bubble " + value.bubble + " " + value.bubble.substring(0,value.bubble.length-4) + "-animate\">" + "<img class=\"bubble-img-link fake-link\" src=\"assets/img/" + value.contents + "\" alt=\"image\">" + "</div>";
        }

        message = emojione.unicodeToImage(message);

        // If the bubble is on the left, call bubbleTyping to provide the typing indicator.
        if(value.bubble === 'bubble-left' || value.bubble === 'bubble-left-img') {
            var container = "<div class=\"bubble-left-container\"></div>";
            $(id).append(container);
            bubbleTyping(id, value.typing).then(function() {
                // setTimeout pauses before posting the bubble based off the delay variable.
                setTimeout (function() {
                    $('> .bubble-left-container', id).last().append(message).on('animationend', function() {
                        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
                        console.log(message);
                        resolve();
                    });
                }, value.delay);
            });
        }
        // If the bubble is on the right, immediately post.
        else if(value.bubble === 'bubble-right' || value.bubble === 'bubble-right-img') {
            // setTimeout pauses before posting the bubble based off the delay variable.
            $(id).append(message).one('animationend', function() {
                $("html, body").animate({ scrollTop: $(document).height() }, "slow");
                console.log(message);
                resolve();
            });
        }
        else if(value.bubble === 'bubble-disconnected') {
            // setTimeout pauses before posting the bubble based off the delay variable.
            $(id).append(message).one('animationend', function() {
                $("html, body").animate({ scrollTop: $(document).height() }, "slow");
                console.log(message);
                resolve();
            });
        }
        // Otherwise, reject the promise.
        else {
            reject(Error("Something went wrong!"));
        }
    });
};
