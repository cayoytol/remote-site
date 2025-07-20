// server.js
const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Настройка папки для загрузки аудио
const upload = multer({ dest: path.join(__dirname, 'uploads/') });

// Раздаём статику из public/ и загруженные файлы
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Эндпоинт для загрузки аудио на сервер
app.post('/upload-audio', upload.single('audio'), (req, res) => {
  const fileUrl = `/uploads/${req.file.filename}`;
  io.emit('playAudio', fileUrl);
  res.json({ url: fileUrl });
});

// Храним текущее состояние фона
let currentColor = '#ffffff';

io.on('connection', socket => {
  // При подключении дисплея сразу шлём текущий фон
  socket.emit('backgroundChanged', currentColor);

  // Обработка смены фона
  socket.on('changeBackground', color => {
    currentColor = color;
    io.emit('backgroundChanged', color);
  });

  // Передача кадров экрана
  socket.on('screenFrame', dataUrl => {
    io.emit('screenFrame', dataUrl);
  });

  // Поиск в Google
  socket.on('googleSearch', query => {
    io.emit('googleSearch', query);
  });

  // Подключение
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
