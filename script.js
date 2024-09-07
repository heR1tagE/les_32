const apiKey = '1bb778f';
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');
const loadingIndicator = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

// Debounce для уникнення надмірних запитів
let debounceTimer;

searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  const query = searchInput.value;
  if (query.length > 2) {
    debounceTimer = setTimeout(() => {
      searchMovies(query);
    }, 300);
  } else {
    clearResults();
  }
});

function searchMovies(query) {
  // Очищуємо попередні помилки та результати
  errorMessage.classList.add('hidden');
  clearResults();
  
  // Показуємо індикатор завантаження
  loadingIndicator.classList.remove('hidden');

  // Виконуємо запит до API
  fetch(`http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      loadingIndicator.classList.add('hidden');
      if (data.Response === "True") {
        displayResults(data.Search);
      } else {
        throw new Error(data.Error);
      }
    })
    .catch(error => {
      loadingIndicator.classList.add('hidden');
      showErrorMessage(error.message);
    });
}

// Відображення результатів
function displayResults(movies) {
  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <p>Year: ${movie.Year}</p>
      <p>Type: ${movie.Type}</p>
    `;
    resultsContainer.appendChild(movieCard);
  });
}

// Очищення попередніх результатів
function clearResults() {
  resultsContainer.innerHTML = '';
}

// Відображення повідомлення про помилку
function showErrorMessage(message) {
  errorMessage.textContent = `Error: ${message}`;
  errorMessage.classList.remove('hidden');
}
