const API_URL = "https://gutendex.com/books";
let currentPage = 1;
let currentSearch = ""; // Uncommented to make it functional
let currentGenre = "";
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || []; // Ensure wishlist is initialized

// Get DOM elements
const loadingElement = document.getElementById('loading'); // Make sure this element exists in your HTML
const bookListContainer = document.getElementById('book-list'); // Make sure this element exists in your HTML

document.addEventListener('DOMContentLoaded', () => {
    fetchBooks(); // Fetch initial books
    setupEventListeners();
});

function fetchBooks(page = 1, query = '') {
    loadingElement.style.display = 'block'; // Show loading indicator
    axios.get(`${API_URL}?page=${page}&search=${query}`)
        .then(response => {
            const books = response.data.results;
            loadingElement.style.display = 'none'; // Hide loading indicator
            bookListContainer.style.display = 'block'; // Show book list

            displayBooks(books); // Display books for the current page
            setupPagination(response.data.count); // Setup pagination controls based on total items
        })
        .catch(error => {
            console.error("Error fetching books:", error);
        });
}

// Call this function on initial load and on pagination changes
fetchBooks(currentPage, currentSearch); // Fetch books for the first page

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
        currentSearch = e.target.value; // Update search query
        fetchBooks(currentPage, currentSearch); // Fetch books based on search
        console.log(currentSearch);
    });

    document.getElementById('genre-filter').addEventListener('change', (e) => {
        currentGenre = e.target.value; // Update genre filter
        fetchBooks(currentPage, currentSearch); // Fetch books based on genre
    });

    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchBooks(currentPage, currentSearch); // Fetch books for the previous page
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        currentPage++;
        fetchBooks(currentPage, currentSearch); // Fetch books for the next page
    });
}

function toggleWishlist(bookId) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (wishlist.includes(bookId)) {
        wishlist = wishlist.filter(id => id !== bookId);
    } else {
        wishlist.push(bookId);
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    fetchBooks(currentPage, currentSearch); // Re-render books to update wishlist icons
}

function setupPagination(totalBooks) {
    const totalPages = Math.ceil(totalBooks / 10); // Assuming 10 books per page
    const pageIndicator = document.getElementById('page-indicator');
    pageIndicator.textContent = currentPage;

    // Logic to enable/disable pagination buttons can be added here
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}
