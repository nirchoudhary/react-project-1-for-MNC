// State to manage task list
const state = {
  taskList: [],
};

// DOM elements
const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task__modal_body");

// HTML structure for rendering tasks
const htmlTaskContent = ({ id, url, title, description, type }) => `
  <div class="col-md-6 col-lg-4 mt-3" id="${id}">
    <div class="card">
      <div class="card-header d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-outline-primary edit-btn" data-task-id="${id}">
          <i class="fa-solid fa-pencil"></i>
        </button>
        <button type="button" class="btn btn-outline-danger delete-btn" data-task-id="${id}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
      <div class="card-body">
        ${url ? `<img src="${url}" alt="Task Image" class="card-img-top" />` : ""}
        <h4 class="card-title">${title}</h4>
        <p class="card-text">${description}</p>
        <span class="badge bg-primary">${type}</span>
      </div>
      <div class="card-footer">
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#showTask"
          data-task-id="${id}"
        >
          Open Task
        </button>
      </div>
    </div>
  </div>
`;

// HTML structure for displaying task details in modal
const htmlModalContent = ({ id, url, title, description }) => `
  <div id="${id}">
    ${url ? `<img src="${url}" alt="Task Image" class="img-fluid mb-3" />` : ""}
    <h4>${title}</h4>
    <p>${description}</p>
  </div>
`;

// Save task to state and local storage
const saveTaskToState = () => {
  localStorage.setItem("taskList", JSON.stringify(state.taskList));
};

// Add new task functionality
document.getElementById("saveChanges").addEventListener("click", () => {
  const url = document.getElementById("imageUrl").value.trim();
  const title = document.getElementById("taskTitle").value.trim();
  const type = document.getElementById("tags").value.trim();
  const description = document.getElementById("description").value.trim();

  // Validate input
  if (!title || !description || !type) {
    alert("All fields are required!");
    return;
  }

  // Create new task object
  const newTask = {
    id: Date.now().toString(), // unique id based on timestamp
    url,
    title,
    description,
    type,
  };

  // Add new task to the state and render it
  state.taskList.push(newTask);
  taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(newTask));

  // Clear form and close modal
  document.getElementById("imageUrl").value = "";
  document.getElementById("taskTitle").value = "";
  document.getElementById("tags").value = "";
  document.getElementById("description").value = "";

  const addNewModal = bootstrap.Modal.getInstance(document.getElementById("addNewModal"));
  addNewModal.hide();

  // Save tasks to localStorage
  saveTaskToState();
});

// Open task details in modal
taskContents.addEventListener("click", (event) => {
  if (event.target.closest(".btn-primary")) {
    const taskId = event.target.closest(".btn-primary").getAttribute("data-task-id");
    const task = state.taskList.find((task) => task.id === taskId);

    if (task) {
      taskModal.innerHTML = htmlModalContent(task);
    }
  }
});

// Edit task functionality (open modal with task data)
taskContents.addEventListener("click", (event) => {
  if (event.target.closest(".edit-btn")) {
    const taskId = event.target.closest(".edit-btn").getAttribute("data-task-id");
    const task = state.taskList.find((task) => task.id === taskId);

    if (task) {
      // Pre-fill the form with task data for editing
      document.getElementById("imageUrl").value = task.url || "";
      document.getElementById("taskTitle").value = task.title;
      document.getElementById("tags").value = task.type;
      document.getElementById("description").value = task.description;

      const saveButton = document.getElementById("saveChanges");
      saveButton.textContent = "Update Task"; // Change button text to indicate update
      saveButton.removeEventListener("click", saveTaskToState); // Remove old event listener

      // Update task functionality when "Update Task" button is clicked
      saveButton.addEventListener("click", () => {
        task.url = document.getElementById("imageUrl").value.trim();
        task.title = document.getElementById("taskTitle").value.trim();
        task.type = document.getElementById("tags").value.trim();
        task.description = document.getElementById("description").value.trim();

        saveTaskToState();
        location.reload(); // Reload to reflect updated task details
      });
    }
  }
});

// Delete task functionality
taskContents.addEventListener("click", (event) => {
  if (event.target.closest(".delete-btn")) {
    const taskId = event.target.closest(".delete-btn").getAttribute("data-task-id");

    // Remove task from state and DOM
    state.taskList = state.taskList.filter((task) => task.id !== taskId);
    document.getElementById(taskId).remove();

    // Save updated task list to localStorage
    saveTaskToState();
  }
});

// Load tasks from localStorage on page load
const loadInitialData = () => {
  const localStorageData = JSON.parse(localStorage.getItem("taskList"));

  if (localStorageData) {
    state.taskList = localStorageData;

    // Render all tasks from localStorage
    state.taskList.forEach((taskData) => {
      taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(taskData));
    });
  }
};

// Call loadInitialData on page load
document.addEventListener("DOMContentLoaded", loadInitialData);
