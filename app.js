var express = require('express'),
	app = express(),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	config = require('./config/config.js'),
	ConnectMongo = require('connect-mongo')(session),
	mongoose = require('mongoose').connect(config.dbURL),
	passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	rooms = [],
	sentimentAnalysis = require('./logic/Sentiment');

app.set('views',path.join(__dirname,'views'));
app.engine('html',require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

var env = process.env.NODE_ENV || 'development';
if(env === 'development'){
	//dev settings
	app.use(session({secret:config.sessionSecret,saveUninitialized:true, resave:true}));
}else{

	//production settingsor 
	app.use(session({
		secret:config.sessionSecret,
		saveUninitialized:true,
		resave:true,
		store: new ConnectMongo({
			mongoose_connection:mongoose.connections[0],
			stringify:true
		})
	})); 
}

// var userSchema = mongoose.Schema({
// 	username:String,
// 	password:String,
// 	fullname:String
// })

// var Person =  mongoose.model('users',userSchema);
// var John =  new Person({
// 	username: 'johndoe',
// 	password : 'john_wants_to_login',
// 	fullname : 'John Doe'
// })
// John.save(function(err){
// 	console.log("Done!");
// })
app.use(passport.initialize());
app.use(passport.session());
require('./auth/passportAuth.js')(passport,FacebookStrategy,config,mongoose);
require('./routes/routes.js')(express,app,passport,config,rooms);


// app.listen(3000,function(){
// 	console.log("ChatCAT is working");
// 	console.log(env);
// })
app.set('port',process.env.PORT || 3000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./socket/socket.js')(io,rooms,sentimentAnalysis);
server.listen(app.get('port'),function(){
	console.log(app.get('port'))
})



