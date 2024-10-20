let currentPage = 1;
let currentSearch = "";
let currentGenre = "";
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
const API_URL = "https://gutendex.com/books";

// Get DOM elements
const loadingElement = document.getElementById('loading');
const bookListContainer = document.getElementById('book-list');

document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();

    document.getElementById('search-bar').addEventListener('input', (event) => {
        currentSearch = event.target.value;
        currentPage = 1;
        fetchBooks();
    });

    document.getElementById('genre-filter').addEventListener('change', (event) => {
        currentGenre = event.target.value;
        currentPage = 1;
        fetchBooks();
    });

    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchBooks();
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        currentPage++;
        fetchBooks();
    });
});

function fetchBooks() {
    loadingElement.style.display = 'block';
    bookListContainer.innerHTML = '';
    let url = `${API_URL}?page=${currentPage}&search=${currentSearch}`;
    if (currentGenre) {
        url += `&topic=${currentGenre}`;
    }

    axios.get(url)
        .then(response => {
            const books = response.data.results;
            loadingElement.style.display = 'none';
            books.forEach(book => {
                const bookEl = document.createElement('div');
                bookEl.classList.add('book');
                bookEl.innerHTML = `
                    <img src="${book.formats['image/jpeg']}" alt="${book.title}">
                    <h3>${book.title}</h3>
                    <p>by ${book.authors.map(author => author.name).join(', ')}</p>
                    <a href="book.html?id=${book.id}">View Details</a>
                    <span class="wishlist-icon ${wishlist.includes(book.id) ? 'liked' : ''}" onclick="toggleWishlist(${book.id})">❤️</span>
                `;
                bookListContainer.appendChild(bookEl);
            });
        })
        .catch(error => {
            console.error("Error fetching books:", error);
            loadingElement.style.display = 'none';
        });
}

function toggleWishlist(bookId) {
    if (wishlist.includes(bookId)) {
        wishlist = wishlist.filter(id => id !== bookId);
    } else {
        wishlist.push(bookId);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    fetchBooks(); 
}
