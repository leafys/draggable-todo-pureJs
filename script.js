const todos = document.querySelectorAll('.todo');
const all_status = document.querySelectorAll('.status');
let draggableTodo = null;

todos.forEach(todo => {
  todo.addEventListener('dragstart', dragStart);
  todo.addEventListener('dragend', dragEnd);
});

function dragStart() {
  draggableTodo = this;
  setTimeout(() => {
    this.style.display = 'none';
  }, 0);
}

function dragEnd() {
  draggableTodo = null;
  setTimeout(() => {
    this.style.display = 'block';
  }, 0);
}

all_status.forEach(status => {
  status.addEventListener('dragover', dragOver);
  status.addEventListener('dragenter', dragEnter);
  status.addEventListener('dragleave', dragLeave);
  status.addEventListener('drop', dragDrop);
});

function dragOver(e) {
  e.preventDefault();
}

function dragEnter() {
  this.style.border = '1px dashed #ccc';
}

function dragLeave() {
  this.style.border = 'none';
}

function dragDrop() {
  this.style.border = 'none';
  console.log(draggableTodo);
  this.appendChild(draggableTodo);
}

/* modal */
const btns = document.querySelectorAll('[data-target-modal]');
const close_modals = document.querySelectorAll('.close-modal');
const overlay = document.getElementById('overlay');

btns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector(btn.dataset.targetModal).classList.add('active');
    overlay.classList.add('active');
  });
});

close_modals.forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('.modal');
    modal.classList.remove('active');
    overlay.classList.remove('active');
  });
});

window.onclick = event => {
  if (event.target == overlay) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.classList.remove('active'));
    overlay.classList.remove('active');
  }
};


/////////////////////////////////////////////////////////////////////////////////////////////

const notesContainer = document.querySelector('.status');
const addNoteBtn = document.querySelector('.todo_submitInput');
const modalField = document.querySelector('#todo_input');

getNotes().forEach(note => {
  const noteElement = createNoteElement(note.id, note.content);
  notesContainer.append(noteElement);
});

addNoteBtn.addEventListener('click', () => addNote());

function getNotes() {
  return JSON.parse(localStorage.getItem('stickynotes-notes') || '[]');
}
console.log(getNotes());

function saveNotes(notes) {
  localStorage.setItem('stickynotes-notes', JSON.stringify(notes));
}

function createNoteElement(id, content) {
  // create div and todo input
  const todo_div = document.createElement('div');
  const text = document.createTextNode(content);

  todo_div.appendChild(text);
  todo_div.classList.add('todo');
  todo_div.setAttribute('draggable', 'true');

  const span = document.createElement('span');
  const span_txt = document.createTextNode('\u00D7');
  span.classList.add('close');
  span.appendChild(span_txt);

  todo_div.appendChild(span);

  no_status.appendChild(todo_div);

  no_status.addEventListener('change', () => {
    updateNote(id, todo_div);
  });

  span.addEventListener('click', () => {
    deleteNote(id, todo_div);
  });

  return todo_div;
}

function addNote() {
  const notes = getNotes();
  const noteObject = {
    id: Math.floor(Math.random() * 100000),
    content: modalField.value,
  };

  const noteElement = createNoteElement(noteObject.id, noteObject.content);
  notesContainer.append(noteElement);

  notes.push(noteObject);
  saveNotes(notes);
}

function updateNote(id, newContent) {
  const notes = getNotes();
  const targetNote = notes.filter(note => note.id == id)[0];

  targetNote.content = newContent;
  saveNotes(notes);
}

function deleteNote(id, element) {
  const notes = getNotes().filter(note => note.id != id);

  saveNotes(notes);
  notesContainer.removeChild(element);
}
