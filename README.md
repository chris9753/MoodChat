# chat
Basic NodeJs chatting app with incoming text sentiment recognition
///
Basic nodejs chat app that detects the sentiment of the incoming
message and fires a custom event(in this case i changed the colour of
the incoming text respectively). Built with Facebook ‘passport’
authentication and socket.io for message broadcasting. development and
production mode available in config.

For now I used console.log for the "userIsTyping" and the "userStoppedTyping" event.
Note: userStoppedTyping is very buggy. I will use the underscore.js 'debounce' method in  the next update.
