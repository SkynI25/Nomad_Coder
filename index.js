let pendingToDos = [];
let finishedToDos = [];
const PENDING = "PENDING";
const FINISHED = "FINISHED";
const form = document.querySelector(".todo-form");
const addTask = form.querySelector(".add-task");
const pendingList = document.querySelector(".pending ul");
const finishedList = document.querySelector(".finished ul");

function store2LS(state, toDos) {
  localStorage.setItem(state, JSON.stringify(toDos));
}

function deleteBtnHandler(evt) {
  const btn = evt.target;
  const li = btn.parentNode;
  const className = evt.target.parentNode.parentNode.parentNode.className;
  const state = className.toUpperCase();

  if (state === PENDING) {
    pendingList.removeChild(li);
    pendingToDos = pendingToDos.filter(todo => `${todo.id}` !== li.id);
    store2LS(state, pendingToDos);
  } else {
    finishedList.removeChild(li);
    finishedToDos = finishedToDos.filter(todo => `${todo.id}` !== li.id);
    store2LS(state, finishedToDos);
  }
}

function okayBtnHandler(evt) {
  const objID = evt.target.parentNode.id;
  const className = evt.target.parentNode.parentNode.parentNode.className;
  const state = className.toUpperCase();
  if (state === PENDING) {
    [...pendingList.children].forEach(el => {
      if (el.id === objID) {
        evt.target.innerHTML = "🔄";
        finishedList.appendChild(el);
        finishedToDos.push(pendingToDos.find(obj => `${obj.id}` === objID));
        store2LS(FINISHED, finishedToDos);
        pendingToDos = pendingToDos.filter(todo => `${todo.id}` !== objID);
        store2LS(PENDING, pendingToDos);
      }
    });
  } else {
    [...finishedList.children].forEach(el => {
      if (el.id === objID) {
        evt.target.innerHTML = "✅";
        // pendingList.appendChild(el);
        pendingToDos.push(finishedToDos.find(obj => `${obj.id}` === objID));
        store2LS(PENDING, pendingToDos);
        finishedToDos = finishedToDos.filter(todo => `${todo.id}` !== objID);
        store2LS(FINISHED, finishedToDos);
      }
    });
  }
}

function paintToDo(todo, state) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const delBtn = document.createElement("button");
  const okayBtn = document.createElement("button");
  const textValue = typeof todo === "string" ? todo : todo.text;
  const newId =
    typeof textValue === "string"
      ? Math.random() * 100000000000000000
      : todo.id;

  span.innerText = textValue;
  delBtn.innerHTML = "❌";
  okayBtn.innerHTML = state === FINISHED ? "🔄" : "✅";
  delBtn.addEventListener("click", deleteBtnHandler);
  okayBtn.addEventListener("click", okayBtnHandler);
  li.id = newId;
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(okayBtn);
  if (state === FINISHED) {
    finishedList.appendChild(li);
  } else {
    pendingList.appendChild(li);
  }

  const toDoObj = { id: newId, text: textValue };
  if (state === FINISHED) {
    finishedToDos.push(toDoObj);
    store2LS(state, finishedToDos);
  } else {
    pendingToDos.push(toDoObj);
    store2LS(state, pendingToDos);
  }
}

function handleSubmit(evt) {
  evt.preventDefault();
  paintToDo(addTask.value, PENDING);
  addTask.value = "";
}

function loadToDos() {
  const loadedPENDING = localStorage.getItem(PENDING);
  const loadedFINISHED = localStorage.getItem(FINISHED);
  if (loadedPENDING !== null) {
    const parsedPENDING = JSON.parse(loadedPENDING);
    parsedPENDING.forEach(function(todo) {
      paintToDo(todo, PENDING);
    });
  }
  if (loadedFINISHED !== null) {
    const parsedFINISHED = JSON.parse(loadedFINISHED);
    parsedFINISHED.forEach(function(todo) {
      paintToDo(todo, FINISHED);
    });
  }
}

function init() {
  loadToDos();
  form.addEventListener("submit", handleSubmit);
}

init();
