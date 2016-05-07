# Burno, a Web-Based Pseudo-Messaging UI Concept

Bruno is a conversational UI concept that lives completely in your web browser. It loosely mimics the iOS Messages interface. It supports image attachments, gifs, emoji, and links. Rather than allowing full text entry, Bruno allows the user to choose from a fixed set of replies.

This UI mockup was a chance for me to learn a variety of newer web technologies, it probably won't work if your browser doesn't suppose [ES2015](https://babeljs.io/docs/learn-es2015/). Bruno uses [CSS3 Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations), [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for flow control, [Emoji One](http://emojione.com) for cross platform emoji support, and [CSS Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes) to keep everything nice and centered. The messages are currently a fixed script of [JQuery](https://jquery.com)-parsed .json files, but he was designed modularly so that a more complicated message source could be implemented later.

I just referred to my program as a 'he'. The future is weird.

If you'd like to try out Bruno, feel free view a preview [here](http://stuart-jones.com/bruno).

## Build Instructions

Bruno's fairly straightforward at this point. Everything runs client side, so you just have to build and go. Give it the standard NodeJS `npm install`, `bower install`, `grunt` workflow, and he should be running on your Localhost in no time.
