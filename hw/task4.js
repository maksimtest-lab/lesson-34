axios.defaults.baseURL = 'https://www.freetestapi.com/api/v1/';
let allBooks = [];
const booksPerPage = 20;

const bookList = document.getElementById('bookList');

const createForm = document.getElementById('createForm');

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

async function loadBooks(params = {}) {
    const requestParams = {
        limit: booksPerPage,
        ...params,
    };

    const res = await axios.get('/books', {
        mode: 'no-cors',
        withCredentials: false,
        crossdomain: true,
        params: requestParams
    }).then((res) => {
        allBooks = res.data;
        renderBooks();
    }).catch((error) => {
        console.error(error);
    })

    return res;

}


loadBooks();