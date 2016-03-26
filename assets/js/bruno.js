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
                        console.log(message);
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
                    console.log(message);
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

$('.details').on('click', function (e) {
    hide();
});

var updateFooterHeight = function(currentHeight) {
    $('#footer-animations').text('@keyframes wrap_slide_up {0% {margin: 0 auto 0px auto;padding: 0 0 0px 0;}100% {margin: 0 auto -'+currentHeight+'px auto;padding: 0 0 '+currentHeight+'px 0;}}@keyframes wrap_slide_down {0% {margin: 0 auto -'+currentHeight+'px auto;padding: 0 0 '+currentHeight+'px 0;}100% {margin: 0 auto 0px auto;padding: 0 0 0px 0;}}@keyframes footer_slide_up {0% { height: 0px; }100% { height: '+currentHeight+'px; }}@keyframes footer_slide_down {0% { height: '+currentHeight+'px; }100% { height: 0px; }}');
};

var ask = function() {
    show();
};

$('.settings').on('click', function (e) {
    show();
});

var hide = function () {
    return new Promise(function(resolve, reject) {
        $('#footer').removeClass('footerHide');
        $('.wrap').removeClass('wrapHide');
        $('#footer').offsetWidth = $('.footer').offsetWidth;
        $('.wrap').offsetWidth = $('.wrap').offsetWidth;
        updateFooterHeight($('#footer > .container-fluid').height());
        Promise.all([animatePromise('#footer', 'footerHide'), animatePromise('.wrap', 'wrapHide')]).then(function(values) {
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
            resolve();
        });
    });
};

var show = function() {
    return new Promise(function(resolve, reject) {
        $('#footer').removeClass('footerHide');
        $('.wrap').removeClass('wrapHide');
        $('#footer').offsetWidth = $('.footer').offsetWidth;
        $('.wrap').offsetWidth = $('.wrap').offsetWidth;
        updateFooterHeight($('#footer > .container-fluid').height());
        Promise.all([animatePromise('#footer', 'footerShow'), animatePromise('.wrap', 'wrapShow')]).then(function(values) {
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
        resolve();
        });
    });
};

var animatePromise = function(element, classToAdd) {
        return new Promise(function(resolve, reject) {
            $(element).addClass(classToAdd).one('animationend', function() {
                resolve();
            });
        });
};


$('.choicesA').on('click', function (e) {
    return new Promise(function(resolve, reject) {
        hide().then(function() {
            display('#bruno-chat', jsonA);
            /*bubble(id, jsonA[0]).then(function() {
                bubble(id, jsonA[1]).then(function() {
                    resolve();
                });
            });*/
        });
    });
});

$('.choicesB').on('click', function (e) {
    return new Promise(function(resolve, reject) {
        hide().then(function() {
        display('#bruno-chat', jsonB);
        /*bubble(id, jsonB[0]).then(function() {
            bubble(id, jsonB[1]).then(function() {
                resolve();
            });
        });*/
        });
    });
});

// Posts a set of json messages as bubbles to the provided id.
// Returns a promise.
/*var display = function(id, data) {
    return new Promise(function(resolve, reject) {
        var sequence = Promise.resolve();
        data.forEach(function(value) {
            sequence = sequence.then(function() {
                console.log(value);
                return bubble(id, value);
            });
            console.log("Howdy");
        });
        console.log("Hey");
        resolve();
    });
};*/

var display = function(id, data) {
    return new Promise(function(resolve, reject) {
        bubble(id, data[0]).then(function() {
            console.log("data[0] done");
            bubble(id, data[1]).then(function() {
                console.log("data[1] done");
                resolve();
            });
        });
        console.log("Really?");
    });
};

$(document).ready(function() {
    display('#bruno-chat', json1).then(show);
});
