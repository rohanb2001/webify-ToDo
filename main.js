import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const form = document.querySelector("form");
const formInputs = document.querySelectorAll("form input");
const select = document.querySelector("form select");
const errorMsg = document.querySelector(".error-msg");
const ul = document.querySelector(".todos");
const emptyTodo = document.querySelector(".empty-todo");
const deleteBtn = document.querySelector(".delete-btn");
const toggleSwitch = document.querySelector(' input[type="checkbox"]');

let formValues = {};
let state = {
  error: false,
  edit: {
    editMode: false,
    editTodoId: null,
  },
  todos: [],
};

function submitForm(e) {
  e.preventDefault();
  if (formValidate()) {
    if (!state.edit.editMode) {
      state.todos.push({ ...formValues, checked: false, id: uuidv4() });
      showUI();
      clearUI();
      formValues = {};
    } else {
      let foundIdx, foundItem;
      state.todos.forEach((item, idx) => {
        if (item.id === state.edit.editTodoId) {
          foundIdx = idx;
          foundItem = item;
          console.log(item.id, state.edit.editTodoId);
        }
      });
      console.log(foundIdx);
      state.todos.splice(foundIdx, 1, {
        ...foundItem,
        ...formValues,
        id: uuidv4(),
      });
      showUI();
      state.edit.editMode = false;
      state.edit.editTodoId = null;
      clearUI();
    }
  } else {
    showErrorMessages("error-active", "Please fill all the fields!");
  }
}

function showUI() {
  if (state.todos.length) {
    let str = state.todos.reduce((acc, curr) => {
      return (
        acc +
        `
                <li class="todo" data-id=${curr.id}>
                            <input type="checkbox" />
                            <div>
                              <h3>${curr.Title}</h3>
                              <p>
                                ${curr.Description}
                              </p>
                              <span class="toto-category">${curr.category}</span>
                              <div class="date"></div>
                            </div>
                            <div><i class="fa-solid fa-pen-to-square"></i></div>
                            
                    </li>
                `
      );
    }, "");

    ul.innerHTML = str;

    emptyTodo.classList.add("disable");
    deleteBtn.classList.remove("disable");
  } else {
    emptyTodo.classList.remove("disable");
    deleteBtn.classList.add("disable");
    ul.innerHTML = "";
  }
}

function clearUI() {
  formInputs.forEach((item) => (item.value = ""));
  select.value = "category";
}

function checkTodo(e) {
  if (e.target.type === "checkbox") {
    state.todos.forEach((todo, idx) => {
      if (todo.id === e.target.parentElement.getAttribute("data-id")) {
        let obj = { ...todo, checked: e.target.checked };
        state.todos.splice(idx, 1, obj);
      }
    });
  }
}

function editTodo(e) {
  if (e.target.classList.contains("fa-pen-to-square")) {
    console.log("clicked");
    let headingText =
      e.target.parentElement.previousElementSibling.children[0].innerText;
    let descriptionText =
      e.target.parentElement.previousElementSibling.children[1].innerText;
    let categoryText =
      e.target.parentElement.previousElementSibling.children[2].innerText;
    console.log(headingText, descriptionText, categoryText);

    formValues = {
      Title: headingText,
      Description: descriptionText,
      category: categoryText,
    };

    state.edit.editMode = true;
    state.edit.editTodoId =
      e.target.parentElement.parentElement.getAttribute("data-id");
    console.log(e.target.parentElement.getAttribute("data-id"));

    formInputs.forEach((item) => {
      item.name === "Title" ? (item.value = headingText) : null;
      item.name === "Description" ? (item.value = descriptionText) : null;
    });

    select.value = categoryText;
  }
}

function showErrorMessages(className, text) {
  errorMsg.classList.add(className);
  errorMsg.textContent = text;
  setTimeout(() => {
    errorMsg.classList.remove(className);
  }, 4000);
}

function deleteTodo() {
  state.todos = state.todos.filter((item, idx) => item.checked === false);
  showUI();
}

function formValidate() {
  let values = Object.values(formValues);
  if (!values.length || values.length < 3) {
    state.error = true;
    return false;
  } else return true;
}

function getFormValues(e) {
  formValues = { ...formValues, [e.target.name]: e.target.value };
}

function switchTheme(e) {
  if (e.target.checked) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}

// Event Listeners
form.addEventListener("submit", submitForm);
form.addEventListener("change", getFormValues);
ul.addEventListener("click", checkTodo);
ul.addEventListener("click", editTodo);
deleteBtn.addEventListener("click", deleteTodo);
toggleSwitch.addEventListener("change", switchTheme);
