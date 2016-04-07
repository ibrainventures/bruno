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
            message = "<div class=\"bubble " + value.bubble + " " + value.bubble.substring(0,value.bubble.length-3) + "Animate\">" + "<img class=\"bubble-img-link fake-link\" src=\"assets/img/" + value.contents + "\" alt=\"image\">" + "</div>";
        }

        message = emojione.unicodeToImage(message);
        message = emojione.shortnameToImage(message);

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

// Set listenders for picture messages.
$('#bruno-chat').on('click', '.bubble-img-link', function (e) {
    return new Promise(function(resolve, reject) {
        $('#lightbox').removeClass('lightbox-hide');
        $('#lightbox').css({'display' : 'block'});
        $('#lightbox').offsetWidth = $('#lightbox').offsetWidth;
        $('#lightbox-container').html('<img id=\"lightbox-image\" src=\"' + $(e.target).attr('src') + '\" alt=\"' + $(e.target).attr('src') + '\">');
        animatePromise('#lightbox', 'lightbox-show').then(function() {
            resolve();
        });
    });
});

/*Temporary Debug Function
$('.details').on('click', function (e) {
    return new Promise(function(resolve, reject) {
        $('#lightbox').removeClass('lightbox-hide');
        $('#lightbox').css({'display' : 'block'});
        $('#lightbox').offsetWidth = $('#lightbox').offsetWidth;
        animatePromise('#lightbox', 'lightbox-show').then(function() {
            resolve();
        });
    });
});*/

/* Temporary Debug Function
$('.settings').on('click', function (e) {
    show();
});*/

$('.lightbox-close').on('click', function (e) {
    return new Promise(function(resolve, reject) {
        $('#lightbox').removeClass('lightbox-show');
        $('#lightbox').offsetWidth = $('#lightbox').offsetWidth;
        animatePromise('#lightbox', 'lightbox-hide').then(function() {
            $('#lightbox').css({'display' : 'none'});
            resolve();
        });
    });
});

$('#lightbox-container').on('click', function (e) {
    return new Promise(function(resolve, reject) {
        $('#lightbox').removeClass('lightbox-show');
        $('#lightbox').offsetWidth = $('#lightbox').offsetWidth;
        animatePromise('#lightbox', 'lightbox-hide').then(function() {
            $('#lightbox').css({'display' : 'none'});
            resolve();
        });
    });
});


// Hide Command Bar
var hide = function () {
    return new Promise(function(resolve, reject) {
        $('#footer').removeClass('footerHide');
        $('.wrap').removeClass('wrapHide');
        $('#footer').offsetWidth = $('#footer').offsetWidth;
        $('.wrap').offsetWidth = $('.wrap').offsetWidth;
        updateFooterHeight($('#footer > .container-fluid').height());
        Promise.all([animatePromise('#footer', 'footerHide'), animatePromise('.wrap', 'wrapHide')]).then(function(values) {
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
            resolve();
        });
    });
};


// Function to update footer height before it is revealed.
var updateFooterHeight = function(currentHeight) {
    $('#footer-animations').text('@keyframes wrap_slide_up {0% {margin: 0 auto 0px auto;padding: 0 0 0px 0;}100% {margin: 0 auto -'+currentHeight+'px auto;padding: 0 0 '+currentHeight+'px 0;}}@keyframes wrap_slide_down {0% {margin: 0 auto -'+currentHeight+'px auto;padding: 0 0 '+currentHeight+'px 0;}100% {margin: 0 auto 0px auto;padding: 0 0 0px 0;}}@keyframes footer_slide_up {0% { height: 0px; }100% { height: '+currentHeight+'px; }}@keyframes footer_slide_down {0% { height: '+currentHeight+'px; }100% { height: 0px; }}');
};

// Function to set listenders for choices on command bar.
// Kicks off new display loop based off of click command.
var commandListeners = function(element) {
    $(element).children().on('click', function (event) {
        return new Promise(function(resolve, reject) {
            hide().then(function() {
                display('#bruno-chat', json, $(event.target).data('link')).then(function() {
                    if('#commands' !== "") {
                        show();
                    }
                });
            });
        });
    });
};

// Show Command Bar
var show = function() {
    return new Promise(function(resolve, reject) {
        $('#footer').removeClass('footerHide');
        $('.wrap').removeClass('wrapHide');
        // Reset CSS Animations
        $('#footer').offsetWidth = $('.footer').offsetWidth;
        $('.wrap').offsetWidth = $('.wrap').offsetWidth;
        updateFooterHeight($('#footer > .container-fluid').height());
        commandListeners('#commands');
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

// Helper Function for Display
var findId = function (data, idToLookFor) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].id == idToLookFor) {
            return(data[i]);
        }
    }
}

// Add new choice bubbles to command bar.
var updateCommands = function(choices) {
    $('#commands').text('');
    choices.forEach(function(value) {
        $('#commands').append('<a class="choices" data-link="'+ value.link +'"><span class="choice" data-link="'+ value.link +'">' + value.contents + '</span></a>');
    });
}

// Posts a set of json messages as bubbles to the provided id.
// Returns a promise.
var display = function(element, data, id) {
    return new Promise(function(resolve, reject) {
        var sequence = Promise.resolve();
        var item = findId(data, id);
        item.messages.forEach(function(value) {
            sequence = sequence.then(function() {
                return bubble(element, value);
            });
        });
        sequence.then(function() {
            updateCommands(item.choices);
            resolve();
        });
    });
};

$(document).ready(function() {
    var visitCount = JSON.parse(localStorage.getItem('bruno-visitCount'));
    if(visitCount === null) {
        visitCount = 0;
    }
    console.log(visitCount);

    var countMsg = 'You have visited this page ' + visitCount + ' times.'
    localStorage.setItem('bruno-visitCount', JSON.stringify(visitCount+1));

    var countJson = [
        {
            'id': '1',
            'messages': [
                {
                    'bubble': 'bubbleLeft',
                    'delay': 0,
                    'typing': 0,
                    'contents': countMsg
                }
            ],
            'choices': []
        }
    ];

    display('#bruno-chat', countJson, '1').then(function() {
        display('#bruno-chat', json, '1').then(function() {
            if($('#commands').children().length > 0) {
                show();
            }
            else {
            }
        });
    });

    /*display('#bruno-chat', json, '1').then(function() {
        if($('#commands').children().length > 0) {
            console.log('if');
            show();
        }
        else {
            console.log('else');
        }
    });*/
});
