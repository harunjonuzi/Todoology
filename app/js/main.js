import { clearElement } from "./clear.js";
import { createList } from "./createList.js";
import { createTask } from "./createTask.js";
////////////////////////////////////////////////////////!
const asideListsContainer = document.querySelector("[data-aside-lists]");
const asideNewListForm = document.querySelector("[data-aside-new-list-form]");
const asideNewListFormInput = document.querySelector(
  "[data-aside-new-list-input]"
);
const asideNewListFormImg = asideNewListForm.querySelector("img");
const asideDeleteListButton = document.querySelector(
  "[data-aside-delete-list]"
);
////////////////////////////////////////////////////////!
const mainTasksDisplayContainer = document.querySelector(
  "[data-main-tasks-container]"
);
const mainListTitle = document.querySelector("[data-main-list-title]");
const mainListCounter = document.querySelector("[data-main-list-count]");
const mainNewTaskForm = document.querySelector("[data-main-new-task-form]");
const mainNewTaskInput = document.querySelector("[data-main-new-task-input]");
const mainClearCompletedTasksButton = document.querySelector(
  "[data-main-clear-tasks]"
);
const mainTasksWrapper = document.querySelector("[data-tasks-wrapper]");
const mainTaskHTMLTemplate = document.getElementById("task-template");
////////////////////////////////////////////////////////!
const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_KEY = "task.selectedListId";
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
// Empty array in the beginning, we populate it with permanentLists(), and then lists becomes an array of objects stored inside the localStorage
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_KEY);
////////////////////////////////////////////////////////!
const svgElementOne = document.querySelector("#svgElement-01");
const svgElementTwo = document.querySelector("#svgElement-02");
const svgElementThree = document.querySelector("#svgElement-03");

const inbox = {
  id: "10",
  name: "Inbox",
  tasks: [],
};
const today = {
  id: "20",
  name: "Today",
  tasks: [],
};
const upcoming = {
  id: "30",
  name: "Upcoming",
  tasks: [],
};

////////////////////////////////////////////////////////!
////////////////////////////////////////////////////////!
////////////////////////////////////////////////////////!
// TODO - I can refactor here, make 1 function, call it twice
// 🟢 We create new lists and populate the aside menu
// Click: ENTER
asideNewListForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // 01 Phase
  const listName = asideNewListFormInput.value;
  if (listName == null || listName === "") return;
  const list = createList(listName);
  // Create an object named list which will populate it with an id, name and tasks [] array.

  // 02 Phase
  asideNewListFormInput.value = null;
  lists.push(list);
  saveAndRender();
});

// Click: IMG BUTTON
asideNewListFormImg.addEventListener("click", function () {
  // 01 Phase
  const listName = asideNewListFormInput.value;
  if (listName == null || listName === "") return;
  const list = createList(listName);
  // Create an object named list which will populate it with an id, name and tasks [] array.

  // 02 Phase
  asideNewListFormInput.value = null;
  lists.push(list);
  saveAndRender();
});

////////////////////////////////////////////////////////!
// 🟢 Whichever list we click, we set the value of the data-list-id to the selectedListId
asideListsContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
    console.log(selectedListId);
    saveAndRender();
  }
});

////////////////////////////////////////////////////////!
// 🟢 Delete lists button
asideDeleteListButton.addEventListener("click", () => {
  if (
    selectedListId === "10" ||
    selectedListId === "20" ||
    selectedListId === "30"
  ) {
    console.log("Cannot delete permanent lists!");
    return;
  } else {
    lists = lists.filter((list) => list.id !== selectedListId);
    selectedListId = "10";
    saveAndRender();
  }
});

////////////////////////////////////////////////////////!
// 🟢 Toggle side menu
const btnHamburger = document.querySelector(".hamburger");
const asideMenu = document.querySelector(".aside");
let toggleMe = true;

btnHamburger.addEventListener("click", function () {
  if (toggleMe) {
    // asideMenu.style.transform = "translateX(-300px)";
    asideMenu.style.display = "none";
  } else {
    // asideMenu.style.transform = "translateX(0)";
    asideMenu.style.display = "";
  }
  toggleMe = !toggleMe;
});

////////////////////////////////////////////////////////!
// 🟢 We create tasks and put them inside the corresponding selectedList tasks array
mainNewTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskName = mainNewTaskInput.value;
  if (taskName == null || taskName === "") return;
  const task = createTask(taskName);
  mainNewTaskInput.value = null;
  const selectedList = lists.find((item) => item.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
});

////////////////////////////////////////////////////////!
// 🟢 Check and uncheck state of the tasks inside the main container without this the clear completed tasks button will not work
mainTasksWrapper.addEventListener("click", (e) => {
  // console.log(e.target);

  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find((item) => item.id === selectedListId);
    // Return: {id: '10', name: 'Inbox', tasks: Array(0)}

    const selectedTask = selectedList.tasks.find(
      (item) => item.id === e.target.id
    );
    // Return: {id: '1696599101686', name: 'Buy tomatoes', complete: false}

    selectedTask.complete = e.target.checked;
    // We toggle the true and false state of the complete key inside that task (object)

    save();
    renderTaskCount(selectedList);
  }
});

////////////////////////////////////////////////////////!
// 🟢 Clear completed tasks
mainClearCompletedTasksButton.addEventListener("click", () => {
  const selectedList = lists.find((list) => list.id === selectedListId);
  // Return: {id: '10', name: 'Inbox', tasks: Array(0)}

  selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
  // Explain: We are filtering the tasks array and returning only the tasks that are not complete (false)
  saveAndRender();
});

////////////////////////////////////////////////////////!
////////////////////////////////////////////////////////!
////////////////////////////////////////////////////////!

// 🚨 Archived
// const selectedList = lists.find((item) => item.id === selectedListId);

// mainTasksWrapper.addEventListener("click", (e) => {
//   const currentTasks = selectedList.tasks;
//   console.log(currentTasks);
//   // (3) [{…}, {…}, {…}]

//   const task = currentTasks.find((item) => item.id === e.target.id);
//   console.log(task);
//   // {id: '1697025925780', name: 'Kikirikuuu', complete: false}

//   // console.log(currentTasks);
//   // console.log(e.target.id);

//   if (e.target.id === task.id) {
//     console.log("TARGETTEEDD");
//   }

//   // console.log(task);

//   // if (e.target.classList.contains("edit-button")) {
//   //   console.log("Edit Button Clicked!");
//   //   // const currentImage = selectedList.tasks.find(
//   //   //   (item) => item.id === editTaskButton.id
//   //   // );
//   //   // currentImage.addEventListener("click", () => {
//   //   //   console.log("Edit Clicked!");
//   //   // });
//   // }
//   // if (e.target.classList.contains("save-button")) {
//   //   console.log("Save Button Clicked!");
//   // }
// });

// const editTASK = document.querySelector(".edit-button");

////////////////////////////////////////////////////////!
////////////////////////////////////////////////////////!
////////////////////////////////////////////////////////!

// 🟢
function pushPermanentLists() {
  lists.push(inbox);
  lists.push(today);
  lists.push(upcoming);
}

////////////////////////////////////////////////////////!
// 🟢
function renderLists() {
  lists.forEach((list) => {
    const asideListElement = document.createElement("li");
    asideListElement.dataset.listId = list.id;
    asideListElement.classList.add("aside__list");
    asideListElement.innerText = list.name;

    if (list.id === selectedListId) {
      asideListElement.classList.add("active-list");
    }
    asideListsContainer.appendChild(asideListElement);
  });
}

////////////////////////////////////////////////////////!
// 🟢
function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(mainTaskHTMLTemplate.content, true);
    const checkbox = taskElement.querySelector(".task__checkbox");
    const inputText = taskElement.querySelector(".task__input");
    const label = taskElement.querySelector("label");
    const editTaskButton = taskElement.querySelector(".edit-button");
    const saveTaskButton = taskElement.querySelector(".save-button");

    checkbox.id = task.id;
    // Return: <input id="1696599101686" type="checkbox">

    checkbox.checked = task.complete;
    // Return: <input id="1696599101686" type="checkbox" checked="">

    label.htmlFor = task.id;
    // Return: <label for="1696599101686">Buy tomatoes</label>

    inputText.value = task.name;
    // Return: Here we take the name of the task and append it to the input

    inputText.id = task.id;

    editTaskButton.id = task.id;
    // Return: <img id='1696599101686' src="app/utilities/svg/edit.svg" alt="Edit button">

    saveTaskButton.id = task.id;
    // Return: <img id='1696599101686' src="app/utilities/svg/edit.svg" alt="Edit button">

    // 🟢 Edit feature
    editTaskButton.addEventListener("click", () => {
      saveTaskButton.style.display = "block";
      editTaskButton.style.display = "none";

      inputText.removeAttribute("readonly");
      inputText.focus();
    });

    // 🟢 Save feature
    function handleSave() {
      const currentTask = selectedList.tasks.find(
        (item) => item.id === editTaskButton.id
      );
      currentTask.name = inputText.value;
      saveTaskButton.style.display = "none";
      editTaskButton.style.display = "block";
      saveAndRender();
    }

    saveTaskButton.addEventListener("click", handleSave);

    // TODO - Enter is not working
    // saveTaskButton.addEventListener("keydown", (e) => {
    //   if (e.key === "Enter") {
    //     handleSave();
    //   }
    // });

    mainTasksWrapper.appendChild(taskElement);
  });
}

// 🟢
function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(
    (item) => !item.complete
  ).length;
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
  mainListCounter.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

////////////////////////////////////////////////////////!
// 🟢
function renderGraphics() {
  // console.log(lists);

  const selectedList = lists.find((list) => list.id === selectedListId);
  // console.log(selectedList);

  if (selectedList.id === "10" && selectedList.tasks.length === 0) {
    svgElementOne.style.display = "block";
    // svgElementOne.style.opacity = "1";
    // svgElementOne.style.transform = "scaleY(1)";
  } else {
    svgElementOne.style.display = "none";
    // svgElementOne.style.opacity = "0";
  }

  if (selectedList.id === "20" && selectedList.tasks.length === 0) {
    svgElementTwo.style.display = "block";
  } else {
    svgElementTwo.style.display = "none";
  }

  if (selectedList.id === "30" && selectedList.tasks.length === 0) {
    svgElementThree.style.display = "block";
  } else {
    svgElementThree.style.display = "none";
  }
}

////////////////////////////////////////////////////////!
//

// const taskWrapperDelegation = document.querySelector("#task-wrapper");
// console.log(taskWrapperDelegation);

// taskWrapperDelegation.addEventListener(
//   "click",
//   (e) => {
//     const clickedElement = e.target;

//     if (clickedElement.tagName.toLowerCase() === "input") {
//       // Remove the 'readonly' attribute to make the input editable
//       clickedElement.removeAttribute("readonly");
//       clickedElement.focus();
//       console.log("Testing");
//     }

//     clickedElement.addEventListener("blur", () => {
//       clickedElement.setAttribute("readonly", "true");
//     });
//   },
//   false
// );

////////////////////////////////////////////////////////!
// 🟢
function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  // setItem('tasks.lists', [{id: '10', name: 'Inbox', tasks: [] }])

  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_KEY, selectedListId);
  // setItem('tasks.selectedListId', 2138917848932)
}

// 🟢
function render() {
  if (lists.length === 0) {
    console.log("Initial Render of the Application");

    // 01 Phase
    selectedListId = "10";
    clearElement(asideListsContainer);
    pushPermanentLists();
    save();

    // 02 Phase
    const selectedSheesh = lists.find((item) => (item.id = selectedListId));
    // Return: {id: '10', name: 'Inbox', tasks: Array(0)}
    mainListTitle.innerText = selectedSheesh.name;
    renderLists();
    renderGraphics();

    // We don't need these two because the tasks.array is empty in the beginning
    // clearElement(mainTasksWrapper);
    // renderTasks(selectedSheesh);

    renderTaskCount(selectedSheesh);
  } else if (lists.length !== 0) {
    console.log("Rendered the Application");

    // 01 Phase
    const selectedList = lists.find((item) => item.id === selectedListId);
    clearElement(asideListsContainer);

    // 02 Phase
    mainListTitle.innerText = selectedList.name;
    renderLists();
    renderGraphics();

    // Main function of our application is to clear and re-render the lists and tasks, thats why I was getting an error (duplicatino) when I was trying to render the tasks without clearing them first.
    clearElement(mainTasksWrapper);
    renderTasks(selectedList);
    renderTaskCount(selectedList);
  }
}

function saveAndRender() {
  save();
  render();
}

////////////////////////////////////////////////////////!
////////////////////////////////////////////////////////!
////////////////////////////////////////////////////////!
// 🚀 RUNNING THE APPLICATION 🚀 //
render();
