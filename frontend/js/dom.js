// dom.js — Управляет интерфейсом

let currentPage = 1;
let totalPages = 1;

// DOM элементы
const movieList = document.getElementById('movieList');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');

/**
 * Отображение списка фильмов на странице.
 * @param {Array} movies - Список фильмов.
 */
const renderMovies = (movies) => {
    movieList.innerHTML = ''; // Очищаем текущий список

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <h3>${movie.title}</h3>
            <img src="http://localhost:3000${movie.imageUrl}" alt="${movie.title}" class="movie-image" />
            <p><strong>Genres:</strong> ${movie.genres.join(', ')}</p>
            <p><strong>Rating:</strong> ${movie.rating}</p>
            <p><strong>Metascore:</strong> ${movie.metascore || 'N/A'}</p>
            <p><strong>Release Date:</strong> ${new Date(movie.releaseDate).toLocaleDateString()}</p>
            <p><strong>Description:</strong> ${movie.description}</p>
        `;
        movieList.appendChild(movieCard);
    });
};

/**
 * Управление кнопками пагинации.
 */
const updatePaginationButtons = () => {
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
};

/**
 * Обработчик обновления фильмов.
 */
const updateMovies = async () => {
    const genres = document.getElementById('genres').value;
    const rating = document.getElementById('rating').value;
    const sortBy = document.getElementById('sortBy').value;
    const sortOrder = document.getElementById('sortOrder').value;

    const params = {
        page: currentPage,
        limit: 10,
        genres: genres ? genres.split(',') : undefined,
        rating: rating || undefined,
        sortBy: sortBy || 'releaseDate',
        sortOrder: sortOrder || 'desc',
    };

    try {
        const data = await fetchMoviesFromAPI(params); // Получаем данные с API
        totalPages = data.pagination.totalPages;

        renderMovies(data.movies); // Рендерим фильмы
        updatePaginationButtons(); // Обновляем кнопки пагинации
    } catch (error) {
        console.error('Error updating movies:', error);
    }
};

// Обработчики кнопок пагинации
prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        updateMovies();
    }
});

nextPageButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        updateMovies();
    }
});

// Начальная загрузка фильмов

await updateMovies();
