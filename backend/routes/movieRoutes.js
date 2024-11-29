const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

// Получить все фильмы
router.get('/', async (req, res) => {
    try {
        // Получаем параметры из query строки
        const { title, genres, ageRating, minRating, maxRating, startDate, endDate, page = 1, limit = 10, sortBy = 'releaseDate', sortOrder = 'desc' } = req.query;

        // Формируем фильтр
        let filter = {};

        if (title) {
            filter.title = { $regex: title, $options: 'i' }; // Поиск по части названия
        }

        if (genres) {
            filter.genres = { $in: genres.split(',') }; // Фильтрация по всем жанрам
        }

        if (ageRating) {
            filter.ageRating = ageRating;
        }

// Фильтрация по рейтингу
        if (minRating || maxRating) {
            filter.rating = {};
            if (minRating) filter.rating.$gte = minRating;
            if (maxRating) filter.rating.$lte = maxRating;
        }

// Фильтрация по дате
        if (startDate || endDate) {
            filter.releaseDate = {};
            if (startDate) filter.releaseDate.$gte = new Date(startDate);
            if (endDate) filter.releaseDate.$lte = new Date(endDate);
        }

        // Пагинация: вычисляем пропуск и количество
        const skip = (page - 1) * limit;

        // Формируем сортировку по названию (если sortBy = title) и по дате (если sortBy = releaseDate)
        const sort = {};
        if (sortBy === 'title') {
            sort.title = sortOrder === 'asc' ? 1 : -1;  // Сортировка по алфавиту
        } else {
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1; // Для других параметров (например, releaseDate)
        }

        // Запрос в базу данных
        const movies = await Movie.find(filter)
            .skip(skip) // Пропуск фильмов на основе пагинации
            .limit(parseInt(limit)) // Ограничение количества фильмов на странице
            .sort(sort); // Сортировка по выбранному полю и порядку

        // Получаем общее количество фильмов для вычисления общей страницы
        const totalMovies = await Movie.countDocuments(filter);
        const totalPages = Math.ceil(totalMovies / limit);

        // Ответ с фильмами и мета-данными пагинации
        res.json({
            movies,
            pagination: {
                currentPage: parseInt(page),
                totalPages: totalPages,
                totalMovies: totalMovies,
                perPage: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Обновить фильм по ID
router.put('/:id', async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(updatedMovie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Удалить фильм по ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json({ message: 'Movie deleted', movie: deletedMovie });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;