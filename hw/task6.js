axios.defaults.baseURL = 'https://dummyjson.com/';
let allTodos = [];
let currentPage = 1;

const searchInput = document.getElementById('searchInput');
const pagesList = document.getElementById('pagesList');
const sortList = document.getElementById('sortList');
const completedList = document.getElementById('completedList');
const todosPerPage = document.getElementById('todosPerPage');
const todoList = document.getElementById('todoList');

const prevBtn = document.getElementById('prevPage');
const nextBtn = document.getElementById('nextPage');

const filterBtn = document.getElementById('filterBtn');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');

const createForm = document.getElementById('createForm');

pagesList.onchange = () => {
    currentPage = Number(pagesList.value) || 1;
    loadTodos();
}

todosPerPage.onchange = () => {
    loadTodos();
}

sortList.onchange = () => {
    loadTodos();
}

createForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const todo = document.getElementById('todo').value;

    const data = {
        todo,
        completed: false,
        userId: 1
    }

    axios.post('/todos/add', data).then((request) => {
        // renderTodos();
        renderTodo(request.data);
    });
})

function renderTodo(todo) {
    const div = document.createElement('div');
    div.className = "todo"
    div.id = `todo_${todo.id}`;

    const titleElement = document.createElement('h4');
    titleElement.className = 'todo-title';
    titleElement.textContent = todo.todo;

    const descrElement = document.createElement('p');
    descrElement.className = 'todo-description';
    descrElement.textContent = `Статус выполнения: ${todo.completed ? 'Выполнено' : 'Не выполнено'}`;

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Изменить';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Удалить';

    editBtn.addEventListener('click', () => {
        const title = prompt('Введите новую задачу', todo.todo);
        const completed = window.confirm("Задача выполнена?");

        axios.put(`/todos/${todo.id}`, {
            todo,
            completed: completed
        }).then(() => {
            // renderTodos();
            titleElement.textContent = title;
        })

        titleElement.textContent = title;
        return false;
    })

    deleteBtn.addEventListener('click', () => {
        axios.delete(`/todos/${todo.id}`).then(() => {
            // renderTodos();
        })
        document.getElementById(`todo_${todo.id}`).remove();
    })

    div.appendChild(titleElement);
    div.appendChild(descrElement);
    div.appendChild(editBtn);
    div.appendChild(deleteBtn);
    todoList.appendChild(div);
}

function renderGenres(todos) {
    const genres = new Set();

    todos.forEach(todo => {
        todo.genre.forEach(genre => {
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

function renderYears(todos) {
    const years = new Set();

    todos.forEach(todo => {
        years.add(todo.publication_year);
    })

    Array.from(years).sort().forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearsList.appendChild(option);
    })

}
function countPages(todos) {
    const pages = Math.ceil(todos.length / todosPerPage.value);

    pagesList.innerHTML = '';

    for (let i = 1; i <= pages; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        option.selected = i == currentPage;
        pagesList.appendChild(option);
    }
}

function renderTodos() {
    todoList.innerHTML = '';

    if (!allTodos.length) {
        todoList.innerHTML = '<p>Нет дел для отображения</p>';

        return;
    }

    allTodos.forEach(todo => {
        renderTodo(todo);
    })
}

function prepareTodos(todos) {
    const searchQuery = searchInput.value;
    const page = currentPage;
    const limit = Number(todosPerPage.value);
    const begin = (page - 1) * limit;
    const end = begin + limit;

    todos = todos.filter((todo) => {
        if (searchQuery) {
            return todo.todo.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    }).filter((todo) => {
        if (completedList.value) {
            if(completedList.value == 'true' && todo.completed) {

                return true;
            } else if(completedList.value == 'false' && !todo.completed) {

                return true;
            }

            return false;
        } else {

            return true;
        }
    })

    if(sortList.value) {
        todos.sort((a, b) => {
            if (sortList.value == 'title') {
                return a.todo > b.todo;
            }
            if (sortList.value == 'completed') {
                return a.completed > b.completed;
            }
        })
    }

    return todos.slice(begin, end);

}

async function loadTodos(params = {}) {
    const maxTododsCount = 1000;
    const requestParams = {
        limit: maxTododsCount,
        ...params,
    };

    const res = await axios.get('/todos', {
        mode: 'no-cors',
        withCredentials: false,
        crossdomain: true,
        params: requestParams
    }).then((res) => {
        const todos = res.data.todos;
        countPages(todos);
        allTodos = prepareTodos(todos);
        renderTodos();
    }).catch((error) => {
        console.error(error);
    })

    return res;

}

prevBtn.addEventListener('click', async () => {

    if (currentPage > 1) {
        currentPage -= 1;
        await loadTodos();
    }
})

nextBtn.addEventListener('click', async () => {

    currentPage += 1;
    await loadTodos();
})

searchBtn.addEventListener('click', async () => {
    currentPage = 1;
    await loadTodos()
})

clearBtn.addEventListener('click', async () => {
    searchInput.value = '';
    currentPage = 1;
    await loadTodos()
})

loadTodos();