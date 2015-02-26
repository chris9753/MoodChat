
module.exports = function(io,rooms,sentimentAnalysis){
var chatrooms = io.of('/roomlist').on('connection',function(socket){
console.log('connection establish on the server!');
socket.emit('roomupdate',JSON.stringify(rooms));
			socket.on('newroom',function(data){
				rooms.push(data);
				socket.broadcast.emit('roomupdate',JSON.stringify(rooms));
				socket.emit('roomupdate',JSON.stringify(rooms));

		})
	})

var messages = io.of('/messages').on('connection',function(socket){
	console.log("Connected to the chatroom");
	socket.on('joinroom',function(data){
		socket.username = data.user;
		socket.userPic = data.userPic;
		socket.join(data.room);
		updateUserList(data.room,true);

	})
	//onuserEvent Broadcast to other users/////////////////////////////////////
	socket.on('newMessage',function(data){
		var context = data.message;
		var sentimentArr = sentimentAnalysis(context);
		data.sentiment = sentimentArr.score;
		console.log(data.sentiment);
		socket.broadcast.to(data.room_number).emit('messagefeed',JSON.stringify(data));
	})

	socket.on('userIsTyping',function(data){
		socket.broadcast.to(data.room_number).emit('userTyped',JSON.stringify(data));
	})

	socket.on('userIsDoneTyping',function(data){
		socket.broadcast.to(data.room_number).emit('userStoppedTyping',JSON.stringify(data));
	})
	
	////////////////////////////////////////////////////////////
function updateUserList(room,updateAll){
var getUsers = getUsersFromRoom(room);
var userList = [];
for(var i in getUsers) {
	userList.push({user:getUsers[i].username,userPic: getUsers[i].userPic});
	}
		
	socket.to(room).emit('updateUserList',JSON.stringify(userList));

if (updateAll){ 
socket.broadcast.to(room).emit('updateUserList',JSON.stringify(userList));

}else {

}
}

function getUsersFromRoom(room){
var usersArray = [];
var nsp = io.of('/messages');
var clientsInRoom = nsp.adapter.rooms[room];
for(var client in clientsInRoom){
usersArray.push(nsp.connected[client]);
}
return usersArray;
}

	socket.on('updateList',function(data){
		updateUserList(data.room);
	})

})
}