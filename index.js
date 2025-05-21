'use strict';

const modalLayout = `
    <div class="modal-wrapper">
      <div class="modal">
      </div>
    </div>`;

const formLayout = `
        <form class="book-form">
          <fieldset>
            <legend>Book data</legend>
            <div class="form-item">
              <label for="name" class="form-label">Enter book name</label>
              <input
                type="text"
                id="name"
                name="name"
                class="form-input"
                placeholder="Hobbit"
                required
              />
            </div>
            <div class="form-item">
              <label for="author" class="form-label">Enter book author</label>
              <input
                type="text"
                id="author"
                name="name"
                class="form-input"
                placeholder="Tolkien"
                required
              />
            </div>
            <div class="form-item">
              <label for="pages" class="form-label">
                Enter number of pages
              </label>
              <input
                type="number"
                id="pages"
                name="pages"
                class="form-input"
                min="1"
                placeholder="0"
                required
              />
            </div>
          </fieldset>

          <button type="submit" class="form-button">Add Book</button>
        </form>`;

const shelf = document.querySelector('.shelf');
const button = document.querySelector('.add-button');

let books = [
  {
    id: 1,
    name: 'Harry Potter',
    author: 'Joan Rolling',
    pages: 295,
    read: false,
  },
  {
    id: 2,
    name: 'The Lord of the Rings',
    author: 'Tolkien',
    pages: 500,
    read: true,
  },
];

function Book(name, author, pages) {
  this.id = crypto.randomUUID();
  this.name = name;
  this.author = author;
  this.pages = pages;
  this.read = false;
}

books.forEach((item) => Object.setPrototypeOf(item, Book.prototype));

Book.prototype.changeReadStatus = function () {
  this.read = !this.read;
};

function addBookToLibrary({ name, author, pages }) {
  const book = new Book(name, author, pages);
  books.push(book);

  renderBooks();
}

function removeBookFromLibrary(id) {
  books = books.filter((item) => item.id != id);

  renderBooks();
}

function createBookCard(id, name, author, pages, read) {
  const el = document.createElement('article');
  el.classList.add('book-card');
  el.innerHTML = `
    <h2>${name}</h2>
    <h3>${author}</h3>
    <span>pages: ${pages}</span>
    <p>status:${read ? 'read' : 'not read'}</p>
    <button class="remove-button">Remove book</button>
    <button class="change-status">Change status</button>
  `;

  el.querySelector('.remove-button').addEventListener('click', () =>
    removeBookFromLibrary(id)
  );

  el.querySelector('.change-status').addEventListener('click', () => {
    const book = books.find((item) => item.id == id);

    book.changeReadStatus();
    renderBooks();
  });

  return el;
}

function renderBooks() {
  shelf.innerHTML = '';

  books.forEach((item) => {
    const bookCard = createBookCard(
      item.id,
      item.name,
      item.author,
      item.pages,
      item.read
    );

    shelf.append(bookCard);
  });
}

function handleSubmit(e) {
  e.preventDefault();

  const modal = document.querySelector('.modal-wrapper');
  const form = document.querySelector('.book-form');

  const bookData = {};

  Array.from(form.querySelectorAll('.form-input')).forEach((item) => {
    bookData[item.id] = item.value;
  });

  addBookToLibrary(bookData);
  modal.remove();
}

button.addEventListener('click', () => {
  const modal = document.createElement('div');
  const form = document.createElement('div');

  modal.innerHTML = modalLayout;
  form.innerHTML = formLayout;

  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-wrapper')) {
      modal.remove();
    }
  });

  form.addEventListener('submit', handleSubmit);

  modal.querySelector('.modal').append(form);

  document.body.insertBefore(modal, document.querySelector('script'));
});

renderBooks();
