const API_URL = "https://gutendex.com/books";
let currentPage = 1;
let currentSearch = "";
let currentGenre = "";
let wishlist = JSON.parse(localStorage.getItem("wishlist"));

document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
    setupEventListeners();
});

function fetchBooks(page = 1, query = '') {
    axios.get(`https://gutendex.com/books?page=${page}&search=${query}`)
        .then(response => {
            const books = response.data.results;
            displayBooks(books); // Display only current page data
            setupPagination(response.data.count); // Setup pagination controls based on total items
        })
        .catch(error => {
            console.error("Error fetching books:", error);
        });
}

// Call this function on initial load and on pagination changes
fetchBooks(1); // Fetch books for the first page


function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';  // Clear previous books
    books.forEach(book => {
        const bookEl = document.createElement('div');
        bookEl.classList.add('book');
        bookEl.innerHTML = `
            <img src="${book.formats['image/jpeg']}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>by ${book.authors.map(author => author.name).join(', ')}</p>
            <p>ID: ${book.id}</p>
            <span class="wishlist-icon ${wishlist.includes(book.id) ? 'liked' : ''}" onclick="toggleWishlist(${book.id})">❤️</span>
        `;
        bookList.appendChild(bookEl);
    });
}

function setupEventListeners() {
    document.getElementById('search-bar').addEventListener('input', (e) => {
        currentSearch = e.target.value;
        fetchBooks();
    });

    document.getElementById('genre-filter').addEventListener('change', (e) => {
        currentGenre = e.target.value;
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

function updatePagination(data) {
    const pageIndicator = document.getElementById('page-indicator');
    pageIndicator.textContent = currentPage;
}


function toggleWishlist(bookId) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (wishlist.includes(bookId)) {
        wishlist = wishlist.filter(id => id !== bookId);
    } else {
        wishlist.push(bookId);
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    fetchBooks();  // Re-render books to update wishlist icons
}

function fetchBookDetails(bookId) {
    axios.get(`https://gutendex.com/books/${bookId}`)
        .then(response => {
            const book = response.data;
            const bookDetails = document.getElementById('book-details');
            bookDetails.innerHTML = `
                <h2>${book.title}</h2>
                <img src="${book.formats['image/jpeg']}" alt="${book.title}">
                <p><strong>Author:</strong> ${book.authors.map(author => author.name).join(', ')}</p>
                <p><strong>ID:</strong> ${book.id}</p>
                <p><strong>Description:</strong> This is a dummy description for the book.</p>
                <span class="wishlist-icon ${wishlist.includes(book.id) ? 'liked' : ''}" onclick="toggleWishlist(${book.id})">❤️</span>
            `;
        })
        .catch(error => console.error("Error fetching book details:", error));
}
