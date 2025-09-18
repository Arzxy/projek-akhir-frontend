// Variabel global
const books = [];
const RENDER_EVENT = "render-book";
const STORAGE_KEY = "BOOKSHELF_APPS_BY_AKMAL";

// Fitur pencarian buku
function searchBook(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(lowerKeyword)
    );

    renderFilteredBooks(filtered);
}

// Render buku hasil pencarian
function renderFilteredBooks(filteredBooks) {
    const incompleteList = document.getElementById("incompleteBookList");
    const completeList = document.getElementById("completeBookList");

    incompleteList.innerHTML = "";
    completeList.innerHTML = "";

    for (const book of filteredBooks) {
        const bookElement = makeBookElement(book);
        if (book.isComplete) {
            completeList.append(bookElement);
        } else {
            incompleteList.append(bookElement);
        }
    }
}

// Pengecekan STORAGE
function isStorageExist() {
    if (typeof Storage === "undefined") {
        alert("Browser kamu tidak mendukung localStorage");
        return false;
    }
    return true;
}

// Simpan data ke localStorage
function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

// Muat data dari localStorage
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData) {
        const data = JSON.parse(serializedData);
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Membuat ID
function generateId() {
    return +new Date();
}

// Membuat objek buku
function generateBookObject(id, title, author, year, isComplete) {
    return { id, title, author, year, isComplete };
}

// Mencari buku berdasarkan ID
function findBook(bookId) {
    return books.find((book) => book.id === bookId) || null;
}

// Mencari index buku berdasarkan ID
function findBookIndex(bookId) {
    return books.findIndex((book) => book.id === bookId);
}

// Manipulasi data buku
function addBook() {
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = Number(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    const id = generateId();
    const newBook = generateBookObject(id, title, author, year, isComplete);
    books.push(newBook);

    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Toggle status selesai/belum selesai
function toggleBookStatus(bookId) {
    const book = findBook(bookId);
    if (!book) return;
    book.isComplete = !book.isComplete;

    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Hapus buku
function removeBook(bookId) {
    const index = findBookIndex(bookId);
    if (index === -1) return;
    books.splice(index, 1);

    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Edit buku
function editBook(bookId) {
    const book = findBook(bookId);
    if (!book) return;

    // Prompt sederhana untuk edit
    const newTitle = prompt("Judul baru:", book.title);
    if (newTitle === null || newTitle.trim() === "") return alert("Gagal memperbarui buku.");

    const newAuthor = prompt("Penulis baru:", book.author);
    if (newAuthor === null || newAuthor.trim() === "") return alert("Gagal memperbarui buku.");

    const newYear = prompt("Tahun baru:", book.year);
    if (newYear === null || newYear.trim() === "" || isNaN(newYear)) return alert("Gagal memperbarui buku.");

    // Update data buku
    book.title = newTitle;
    book.author = newAuthor;
    book.year = Number(newYear);

    alert("Buku berhasil diperbarui!");

    // Simpan perubahan ke localStorage
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Membuat elemen buku
function makeBookElement(book) {
    const titleEl = document.createElement("h3");
    titleEl.innerText = book.title;
    titleEl.setAttribute("data-testid", "bookItemTitle");

    const authorEl = document.createElement("p");
    authorEl.innerText = "Penulis: " + book.author;
    authorEl.setAttribute("data-testid", "bookItemAuthor");

    const yearEl = document.createElement("p");
    yearEl.innerText = "Tahun: " + book.year;
    yearEl.setAttribute("data-testid", "bookItemYear");

    const actionContainer = document.createElement("div");

    const statusButton = document.createElement("button");
    statusButton.innerText = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
    statusButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    statusButton.addEventListener("click", () => toggleBookStatus(book.id));

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.addEventListener("click", () => removeBook(book.id));

    const editButton = document.createElement("button");
    editButton.innerText = "Edit Buku";
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.addEventListener("click", () => editBook(book.id));

    actionContainer.append(statusButton, deleteButton, editButton);

    const container = document.createElement("div");
    container.setAttribute("data-bookid", book.id);
    container.setAttribute("data-testid", "bookItem");
    container.append(titleEl, authorEl, yearEl, actionContainer);

    return container;
}

// Event Listener Utama atau Inti
document.addEventListener("DOMContentLoaded", () => {
    // Event button tambah buku
    const form = document.getElementById("bookForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        addBook();
        form.reset();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }

    // Event button cari buku
    const searchForm = document.getElementById("searchBook");
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = document.getElementById("searchBookTitle").value;
        searchBook(keyword);
    });
});

// Event render buku
document.addEventListener(RENDER_EVENT, () => {
    const incompleteList = document.getElementById("incompleteBookList");
    const completeList = document.getElementById("completeBookList");

    incompleteList.innerHTML = "";
    completeList.innerHTML = "";

    // Render semua buku
    for (const book of books) {
        const bookElement = makeBookElement(book);
        if (book.isComplete) {
            completeList.append(bookElement);
        } else {
            incompleteList.append(bookElement);
        }
    }
});
