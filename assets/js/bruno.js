var json = [
    {
        'bubble': 'bubbleRight',
        'delay': 0,
        'typing': 0,
        'contents': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque voluptatum consequatur, dicta magnam quis ipsa error quod eveniet odio quo, expedita numquam odit, voluptatem. Necessitatibus beatae, enim similique quos! Excepturi.'
    },
    {
        'bubble': 'bubbleLeft',
        'delay': 0,
        'typing': 0,
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
        'delay': 0,
        'typing': 0,
        'contents': 'Is that the placeholder psudo-latin designers use? 🤓'
    },
    {
        'bubble': 'bubbleRight',
        'delay': 0,
        'typing': 0,
        'contents': 'You got it. 👌'
    },
    {
        'bubble': 'bubbleRight',
        'delay': 0,
        'typing': 0,
        'contents': 'How does a hash sound for dinner by the way?'
    },
    {
        'bubble': 'bubbleRightImg',
        'delay': 0,
        'typing': 0,
        'contents': 'hash.jpg'
    },
    {
        'bubble': 'bubbleLeft',
        'delay': 0,
        'typing': 0,
        'contents': 'That looks amazing.'
    },
    {
        'bubble': 'bubbleRight',
        'delay': 0,
        'typing': 0,
        'contents': 'I know right?'
    },
    {
        'bubble': 'bubbleLeft',
        'delay': 0,
        'typing': 0,
        'contents': 'More tasty noms pls. 😻'
    },
    {
        'bubble': 'bubbleRight',
        'delay': 0,
        'typing': 0,
        'contents': 'Hey wait.'
    },
    {
        'bubble': 'bubbleRight',
        'delay': 0,
        'typing': 0,
        'contents': 'Why are you called "Bruno"?'
    },
    {
        'bubble': 'bubbleLeft',
        'delay': 0,
        'typing': 0,
        'contents': 'It\'s a Ms. Marvel reference. Bruno is her nerdy best friend.'
    },
    {
        'bubble': 'bubbleLeftImg',
        'delay': 0,
        'typing': 0,
        'contents': 'bruno.png'
    },
    {
        'bubble': 'bubbleLeft',
        'delay': 0,
        'typing': 0,
        'contents': 'Am I your nerdy best friend?'
    },
    {
        'bubble': 'bubbleRight',
        'delay': 0,
        'typing': 0,
        'contents': 'No.'
    },
    {
        'bubble': 'bubbleLeft',
        'delay': 0,
        'typing': 0,
        'contents': '😱'
    }
];

var bubbleTyping = function(id, typing) {
    $('> .bubbleLeftContainer', id).last().append("<div class=\"bubble bubbleLeft bubbleLeftAnimate bubbleTyping\"><span class=\"typing\"><span class=\"circle dot1\"></span><span class=\"circle dot2\"></span><span class=\"circle dot3\"></span></span></div>").one('animationend', function() {
        setTimeout(function() {
            $('> .bubbleLeftContainer > .bubbleTyping', id).last().addClass("bubbleLeftAnimateExit");
        }, typing);
    });
};

(function($) {
    $.fn.extend({
        bubble: function(options) {
            options = $.extend( {}, $.bubble.defaults, options );

            this.each(function() {
                new $.bubble(this,options);
            });
            return this;
        }
    });

    // ctl is the element, options is the set of defaults + user options
    $.bubble = function(id, value) {
        var message;

        if(value.bubble === 'bubbleLeft' || value.bubble === 'bubbleRight') {
            message = "<div class=\"bubble " + value.bubble + " " + value.bubble + "Animate\">" + value.contents + "</div>";
        }
        else if(value.bubble === 'bubbleLeftImg' || value.bubble === 'bubbleRightImg') {
            message = "<div class=\"bubble " + value.bubble + " " + value.bubble.substring(0,value.bubble.length-3) + "Animate\">" + "<img src=\"assets/img/" + value.contents + "\" alt=\"image\">" + "</div>";
        }

        if(value.bubble === 'bubbleLeft' || value.bubble === 'bubbleLeftImg') {
            $(id).append("<div class=\"bubble bubbleLeftContainer\"></div>");
            bubbleTyping(id, value.delay);
            //console.log($('> div.bubbleLeftContainer', id).last());
            $('> .bubbleLeftContainer', id).last().append(message);
        }
        else if(value.bubble === 'bubbleRight' || value.bubble === 'bubbleRightImg') {
            $(id).append(message);
        }
        else {
            message = "<div class=\"bubble" + value.bubble + "\">" + "Something went wrong. :/" + "</div>";
            $(id).append(message);
        }
    };

    // option defaults
    $.bubble.defaults = {
        'bubble': 'bubbleLeft',
        'delay': 100,
        'typing': 100,
        'contents': 'Something went wrong!'
    };

})(jQuery);

var trueDisplay = function(id, data) {
    if(data[0] !== undefined) {
        $(id).bubble(data[0]).one('animationend', function() {
            setTimeout(function() {
                trueDisplay(id, data.slice(1,data.length));
            }, data[0].delay);
        });
    }
    else {
        console.log("Finished!");
        return;
    }
};

var display = function(id, message) {
    // Variable of total time since first post.
    var timeline = 0;
    // Standard gap between messages.
    var chatWait = 2000;
    // Typing delay.
    var delay = 1000;
    // Number of times the typing indicator has been triggered.
    var delays = 0;
    // Time it takes for the typing indicator to leave the screen.
    var exit = 300;
    // Number of times the typing indicator has exited the screen.
    var exits = 0;
    // Delay before typing indicator posts appear.
    var typedDelay = delay + exit + 100;
    // Custom delays as specified in the json file.
    var pause = 0;
    // Custom typing indicator extension.
    var typing = 0;

    $.each(json, function (index, value) {
        var message;
        if(value.bubble === 'bubbleRight' || value.bubble === 'bubbleLeft') {
            message = "<div class=\"bubble " + value.bubble + " " + value.bubble + "Animate\">" + value.contents + "</div>";
        }
        else if(value.bubble === 'bubbleRightImg' || value.bubble === 'bubbleLeftImg') {
            message = "<div class=\"bubble " + value.bubble + " " + value.bubble.substring(0,value.bubble.length-3) + "Animate\">" + "<img src=\"assets/img/" + value.contents + "\" alt=\"image\">" + "</div>";
        }
        else {
            message = "<div class=\"bubble" + value.bubble + "\">" + "Something went wrong. :/" + "</div>";
        }


        if(value.bubble === 'bubbleLeft' || value.bubble === 'bubbleLeftImg') {
            exits = exits + 1;
            delays = delays + 1;
        }
        pause = pause + value.delay;
        typing = typing + value.typing;


        //console.log("timeline = " + timeline + " = ((index(" + index + ")+1) * chatWait(" + chatWait + ")) + (delays(" + delays + ") * delay(" + delay + ")) + (exits(" + exits + ") * exit(" + exit + ")) + pause(" + pause +") + typing(" + typing + ")");

        setTimeout(function() {
            if(value.bubble === 'bubbleLeft' || value.bubble === 'bubbleLeftImg') {
                var typing = "<div class=\"bubble bubbleLeft bubbleLeftAnimate bubbleTyping\"><span class=\"typing\"><span class=\"circle dot1\"></span><span class=\"circle dot2\"></span><span class=\"circle dot3\"></span></span></div>";
                $(id).append(typing);
                $("html, body").animate({ scrollTop: $(document).height() }, "slow");
                setTimeout(function() {
                    // Hack to re-trigger animations
                    $('.bubble:last-child').offsetWidth = $('.bubble:last-child').offsetWidth;

                    $('.bubble:last-child').addClass(value.bubble + 'AnimateExit');
                    setTimeout(function() {
                        $('.bubble:last-child').remove();
                    }, exit);
                }, delay + value.typing);
                setTimeout(function() {
                    $(id).append(message);
                    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
                }, typedDelay + value.typing);
            }
            else {
                $(id).append(message);
                $("html, body").animate({ scrollTop: $(document).height() }, "slow");
            }
        }, timeline);
        timeline =  ((index+1) * chatWait) + (delays * delay) + (exits * exit) + pause + typing;
    });
}

$(document).ready(function() {
    //display('#bruno-chat', json);
    trueDisplay('#bruno-chat', json);
});
