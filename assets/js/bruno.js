/*** DEBUG FUNCTIONS ***/
/*Temporary Debug Function
$('.details').on('click', function (e) {
    show();
});*/

/* Temporary Debug Function
$('.settings').on('click', function (e) {
    show();
});*/

/*** LIGHTBOX FUNCTIONS ***/
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

/*** COMMAND BAR FUNCTIONS ***/
// Hide Command Bar
var hide = function () {
    return new Promise(function(resolve, reject) {
        $('#footer').removeClass('footer-hide');
        $('.wrap').removeClass('wrap-hide');
        $('#footer').offsetWidth = $('#footer').offsetWidth;
        $('.wrap').offsetWidth = $('.wrap').offsetWidth;
        updateFooterHeight($('#footer > .container-fluid').height());
        Promise.all([animatePromise('#footer', 'footer-hide'), animatePromise('.wrap', 'wrap-hide')]).then(function(values) {
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
            resolve();
        });
    });
};

// Show Command Bar
var show = function() {
    return new Promise(function(resolve, reject) {
        $('#footer').removeClass('footer-hide');
        $('.wrap').removeClass('wrap-hide');
        // Reset CSS Animations
        $('#footer').offsetWidth = $('.footer').offsetWidth;
        $('.wrap').offsetWidth = $('.wrap').offsetWidth;
        Promise.all([animatePromise('#footer', 'footer-show'), animatePromise('.wrap', 'wrap-show')]).then(function(values) {
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
        resolve();
        });
    });
};


// Function to update footer height before it is revealed.
var updateFooterHeight = function(currentHeight) {
    $('#footer-animations').text('@keyframes wrap-slide-up {0% {margin: 0 auto 0px auto;padding: 0 0 0px 0;}100% {margin: 0 auto -'+currentHeight+'px auto;padding: 0 0 '+currentHeight+'px 0;}}@keyframes wrap-slide-down {0% {margin: 0 auto -'+currentHeight+'px auto;padding: 0 0 '+currentHeight+'px 0;}100% {margin: 0 auto 0px auto;padding: 0 0 0px 0;}}@keyframes footer-slide-up {0% { height: 0px; }100% { height: '+currentHeight+'px; }}@keyframes footer-slide-down {0% { height: '+currentHeight+'px; }100% { height: 0px; }}');
};

// Function to set listenders for choices on command bar.
// Kicks off new display loop based off of click command.
var commandListeners = function(element) {
    $(element).children().one('click', function (event) {
        return new Promise(function(resolve, reject) {
            hide().then(function() {
                display('#bruno-chat', json, $(event.target).data('link')).then(function() {
                    if($('#commands').children().length > 0) {
                        show();
                    }
                });
            });
        });
    });
};

// Add new choice bubbles to command bar.
var updateCommands = function(choices) {
    $('#commands').text('');
    choices.forEach(function(value) {
        $('#commands').append('<a class="choices" data-link="'+ value.link +'"><span class="choice" data-link="'+ value.link +'">' + value.contents + '</span></a>');
    });
}

/*** UTILITY FUNCTIONS ***/
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
            updateFooterHeight($('#footer > .container-fluid').height());
            commandListeners('#commands');
            resolve();
        });
    });
};

$(document).ready(function() {
    var visitCount = JSON.parse(localStorage.getItem('brunoVisitCount'));
    if(visitCount === null) {
        visitCount = 0;
    }
    console.log(visitCount);

    var countMsg = 'You have visited this page ' + visitCount + ' times.'
    localStorage.setItem('brunoVisitCount', JSON.stringify(visitCount+1));

    var countJson = [
        {
            'id': '1',
            'messages': [
                {
                    'bubble': 'bubble-left',
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
});
