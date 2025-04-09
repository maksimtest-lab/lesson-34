axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';
let allPosts = [];
let currentPage = 1;
const postsPerPage = 10;

let isFiltering = false;

const filterInput = document.getElementById('filterUserId');
const searchInput = document.getElementById('searchInput');
const postsList = document.getElementById('postsList');
const prevBtn = document.getElementById('prevPage');
const nextBtn = document.getElementById('nextPage');

const filterBtn = document.getElementById('filterBtn');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');

const createForm = document.getElementById('createForm');

createForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;
    const userId = document.getElementById('userId').value;

    axios.post('/posts', {
        title,
        body,
        userId,
    }).then((request) => {
        console.log(request);
        // renderPosts();
        renderPost(request.data);
    });
})

function renderPost(post) {
    const div = document.createElement('div');
    div.className = "post"
    div.id = `post_${post.id}`;

    const titleElement = document.createElement('h3');
    titleElement.textContent = post.title;

    const bodyElement = document.createElement('p');
    bodyElement.textContent = post.body;

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Изменить';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Удалить';

    editBtn.addEventListener('click', () => {
        const title = prompt('Введите новый заголовок', post.title);
        const body = prompt('Введите новый текст', post.body);

        axios.put(`/posts/${post.id}`, {
            title,
            body,
        }).then(() => {
            // renderPosts();
            titleElement.textContent = title;
            bodyElement.textContent = body;
        })
    })

    deleteBtn.addEventListener('click', () => {
        axios.delete(`/posts/${post.id}`).then(() => {
            // renderPosts();
            document.getElementById(`post_${post.id}`).remove();
        })
    })

    div.appendChild(titleElement);
    div.appendChild(bodyElement);
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);
    postsList.appendChild(div);
}

function renderPosts() {
    postsList.innerHTML = '';

    if (!allPosts.length) {
        postsList.innerHTML = '<p>Нет постоав для отображения</p>';

        return;
    }

    allPosts.forEach(post => {
        renderPost(post);
    })
}

async function loadPosts(params = {}) {
    const requestParams = {
        _limit: postsPerPage,
        _page: currentPage,
        ...params,
    };

    if (isFiltering) {
        delete requestParams._limit;
        delete requestParams._page;
    }

    const res = await axios.get('/posts', { params: requestParams })
    allPosts = res.data;
    renderPosts();
}

prevBtn.addEventListener('click', async () => {
    if (isFiltering) {
        return;
    }

    if (currentPage > 1) {
        currentPage -= 1;
        await loadPosts();
    }
})

nextBtn.addEventListener('click', async () => {
    if (isFiltering) {
        return;
    }

    currentPage += 1;
    await loadPosts();
})

filterBtn.addEventListener('click', async () => {
    const userId = filterInput.value;
    isFiltering = true;
    await loadPosts({ userId })
})

searchBtn.addEventListener('click', async () => {
    const searchQuery = searchInput.value;
    isFiltering = true;
    await loadPosts({ q: searchQuery })
})

clearBtn.addEventListener('click', async () => {
    isFiltering = false;
    filterInput.value = '';
    searchInput.value = '';
    currentPage = 1;
    await loadPosts()
})

loadPosts();