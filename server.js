const express = require('express');
const path = require('path');

//websocket com http
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//seta o front na pasta public e adicionar html
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
	res.render('index.html')
});

//salva as mensagem no array
let messages = [];

//escuta qualquer conexão nova de socket
io.on('connection', socket => {
	console.log(`Socket Novo: ${socket.id}`);

	//envia as mensagem do array
	socket.emit('previousMessages', messages);

	//recebe as mensagems do front
	socket.on('sendMessage', data => {
		messages.push(data);
		//envia a mensagem para todos conectados no socket
		socket.broadcast.emit('receivedMessage', data);
	});
});

server.listen(3000);