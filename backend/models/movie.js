const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },       // Название фильма (обязательное)
    description: { type: String },                 // Описание фильма
    genres: { type: [String] },                    // Массив жанров
    releaseDate: { type: Date },                   // Дата релиза
    ageRating: { type: String },                   // Возрастной рейтинг
    rating: { type: Number },                      // Рейтинг
    metascore: { type: Number },                   // Метаоценка
    imageUrl: { type: String }                     // Путь к изображению фильма
});

module.exports = mongoose.model('Movie', movieSchema);