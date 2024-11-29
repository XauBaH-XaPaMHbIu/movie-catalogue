const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const movieRoutes = require('./routes/movieRoutes');

const app = express();

// Middleware для логирования запросов
app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
});

// Middleware для обработки других запросов
app.use(cors());
app.use(bodyParser.json());

// Настройка multer для загрузки изображений в frontend/images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Путь к папке frontend/images на сервере
        cb(null, path.join(__dirname, '../frontend/images'));
    },
    filename: (req, file, cb) => {
        // Генерация уникального имени файла
        cb(null, Date.now() + path.extname(file.originalname)); // Имя файла с расширением
    }
});

const upload = multer({ storage: storage });

// MongoDB Connection
const MONGO_URI = 'mongodb://127.0.0.1:27017/movie_catalog'; // Локальная база MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));

// API Routes
app.use('/api/movies', movieRoutes);

// Роут для загрузки изображения
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    // Путь к изображению
    const imagePath = '/images/' + req.file.filename;

    // Здесь нужно добавить логику сохранения пути в базе данных (например, для фильма)
    // Пример:
    // const movie = new Movie({ title: req.body.title, imageUrl: imagePath });
    // movie.save();

    res.json({ message: 'Image uploaded successfully!', imageUrl: imagePath });
});

// Статическая папка для изображений
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Default Route (можно использовать для отладки)
app.get('/', (req, res) => {
    res.send('Movie Catalog Backend is running!');
});

// Start the server
const PORT = 3000; // Используем фиксированный порт
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});