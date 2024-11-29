// api.js — Управляет запросами к серверу

const API_BASE_URL = 'http://localhost:3000/api/movies';

/**
 * Получение фильмов с сервера.
 * @param {Object} params - Параметры фильтрации, сортировки и пагинации.
 * @returns {Promise<Object>} - Объект с фильмами и данными о пагинации.
 */
const fetchMoviesFromAPI = async (params) => {
    const url = new URL('http://localhost:3000/api/movies'); // Адрес вашего бэкенда
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]);
        }
    });

    try {
        const response = await fetch(url);  // Отправка запроса на сервер
        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }
        console.log(response);
        return await response.json();  // Возвращаем данные из ответа
    } catch (error) {
        console.error('Error fetching movies from API:', error);
        throw error;
    }
};
