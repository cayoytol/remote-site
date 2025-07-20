// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// раздаём статику из public/
app.use(express.static('public'));

// текущее состояние
let currentColor = '#ffffff';

io.on('connection', socket => {
  // когда новый дисплей подключился — сразу шлём цвет
  socket.emit('backgroundChanged', currentColor);

  // фон
  socket.on('changeBackground', color => {
    currentColor = color;
    io.emit('backgroundChanged', color);
  });

  // музыка
  socket.on('playAudio', dataUrl => {
    io.emit('playAudio', dataUrl);
  });

  // передача кадров экрана
  socket.on('screenFrame', dataUrl => {
    io.emit('screenFrame', dataUrl);
  });

  // поиск Google
  socket.on('googleSearch', query => {
    io.emit('googleSearch', query);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
