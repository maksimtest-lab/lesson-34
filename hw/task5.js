axios.defaults.baseURL = 'https://www.freetestapi.com/api/v1/';
let allBooks = [];
let currentPage = 1;

const searchInput = document.getElementById('searchInput');
const genresList = document.getElementById('genres');
const yearsList = document.getElementById('years');
const pagesList = document.getElementById('pagesList');
const booksPerPage = document.getElementById('booksPerPage');
const bookList = document.getElementById('bookList');

const prevBtn = document.getElementById('prevPage');
const nextBtn = document.getElementById('nextPage');

const filterBtn = document.getElementById('filterBtn');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');

const createForm = document.getElementById('createForm');

pagesList.onchange = () => {
    currentPage = Number(pagesList.value) || 1;
    loadBooks();
}

booksPerPage.onchange = () => {
    loadBooks();
}

createForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const author = document.getElementById('author').value;
    const publication_year = document.getElementById('publication_year').value;
    const genre = document.getElementById('genre').value;
    const cover_image = document.getElementById('cover_image').value;

    const data = {
        title,
        description,
        author,
        publication_year,
        genre,
        cover_image
    }

    // В данном апи нельзя создавать книги(
    // axios.post('/books', data).then((request) => {
    //     // console.log(request);
    //     // renderBooks();
    //     renderBook(request.data);
    // });
    renderBook(data);
})

function renderBook(book) {
    const div = document.createElement('div');
    div.className = "book"
    div.id = `book_${book.id}`;

    const titleElement = document.createElement('h4');
    titleElement.className = 'book-title';
    titleElement.textContent = book.title;

    const imgElement = document.createElement('img');
    imgElement.className = 'book-image';
    imgElement.src = book.cover_image.replace('cc6600', 'b7c0f1');
    imgElement.alt = book.title;

    const bodyElement = document.createElement('div');
    bodyElement.className = 'book-body';

    const bookDetailsElement = document.createElement('ul');
    bookDetailsElement.className = 'book-details';
    bookDetailsElement.innerHTML = `
        <li>Автор: ${book.author}</li>
        <li>Год: ${book.publication_year}</li>
        <li>Genre: ${String(book.genre).replace(',', ', ')}</li>
    `;

    bodyElement.appendChild(bookDetailsElement);

    const descrElement = document.createElement('p');
    descrElement.className = 'book-description';
    descrElement.textContent = book.description;
    bodyElement.appendChild(descrElement);

    const footerElement = document.createElement('div');
    footerElement.className = 'book-footer';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Изменить';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Удалить';

    editBtn.addEventListener('click', () => {
        const title = prompt('Введите новый заголовок', book.title);
        const description = prompt('Введите новое описание', book.description);

    //     axios.put(`/books/${book.id}`, {
    //         title,
    //         description
    //     }).then(() => {
    //         // renderBooks();
    //         titleElement.textContent = title;
    //         descrElement.textContent = description;
    //     })
        // В данном апи нельзя обновлять(
        titleElement.textContent = title;
        descrElement.textContent = description;
        return false;
    })

    deleteBtn.addEventListener('click', () => {
        // axios.delete(`/books/${book.id}`).then(() => {
        //     // renderBooks();
        // })
        // В данном апи нельзя удалять(
        document.getElementById(`book_${book.id}`).remove();
    })

    div.appendChild(titleElement);
    div.appendChild(imgElement);
    div.appendChild(bodyElement);
    div.appendChild(footerElement);
    footerElement.appendChild(editBtn);
    footerElement.appendChild(deleteBtn);
    bookList.appendChild(div);
}

function renderGenres(books) {
    const genres = new Set();

    books.forEach(book => {
        book.genre.forEach(genre => {
            genres.add(genre);
        })
    })

    Array.from(genres).sort().forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre[0].toUpperCase() + genre.slice(1);
        genresList.appendChild(option);
    })

}

function renderYears(books) {
    const years = new Set();

    books.forEach(book => {
        years.add(book.publication_year);
    })

    Array.from(years).sort().forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearsList.appendChild(option);
    })

}
function countPages(books) {
    const pages = Math.ceil(books.length / booksPerPage.value);

    pagesList.innerHTML = '';
    console.log(currentPage);

    for (let i = 1; i <= pages; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        option.selected = i == currentPage;
        pagesList.appendChild(option);
    }
}

function renderBooks() {
    bookList.innerHTML = '';

    if (!allBooks.length) {
        bookList.innerHTML = '<p>Нет книг для отображения</p>';

        return;
    }

    allBooks.forEach(book => {
        renderBook(book);
    })
}

function prepareBooks(books) {
    const searchQuery = searchInput.value;
    const page = currentPage;
    const limit = Number(booksPerPage.value);
    const begin = (page - 1) * limit;
    const end = begin + limit;

    books = books.filter((book) => {
        if (searchQuery) {
            return book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return book;
    }).filter((book) => {
        if (genresList.value) {
            return book.genre.includes(genresList.value);
        }
        return book;
    }).filter((book) => {
        if (yearsList.value) {
            return book.publication_year == yearsList.value;
        }
        return book;
    });

    return books.slice(begin, end);

}

async function loadBooks(params = {}) {
    const maxBookdsCount = 50;
    const requestParams = {
        limit: maxBookdsCount, // это все доступные книги, тут я не нашел возможности пагинации, выбираю все книги в одном запросе, пагинация будет искуственная
        ...params,
    };

    const res = await axios.get('/books', {
        mode: 'no-cors',
        withCredentials: false,
        crossdomain: true,
        params: requestParams
    }).then((res) => {
        const books = res.data;
        renderGenres(books);
        renderYears(books);
        countPages(books);
        allBooks = prepareBooks(books);
        renderBooks();
    }).catch((error) => {
        console.error(error);
    })

    return res;

}

prevBtn.addEventListener('click', async () => {

    if (currentPage > 1) {
        currentPage -= 1;
        await loadBooks();
    }
})

nextBtn.addEventListener('click', async () => {

    currentPage += 1;
    await loadBooks();
})

searchBtn.addEventListener('click', async () => {
    currentPage = 1;
    await loadBooks()
})

clearBtn.addEventListener('click', async () => {
    filterInput.value = '';
    searchInput.value = '';
    currentPage = 1;
    await loadBooks()
})

loadBooks();