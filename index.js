const state = {
  taskList: [],
};

const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task__modal_body");

const htmlTaskContent = ({ id, url, title, description, type }) => `
  <div class="col-md-6 col-lg-4 mt-3" id="${id}">
    <div class="card">
      <div class="card-header d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-outline-primary" name="${id}">
          <i class="fa-solid fa-pencil"></i>
        </button>
        <button type="button" class="btn btn-outline-danger" name="${id}">
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

const htmlModalContent = ({ id, url, title, description }) => `
  <div id="${id}">
    ${url ? `<img src="${url}" alt="Task Image" class="img-fluid mb-3" />` : ""}
    <h4>${title}</h4>
    <p>${description}</p>
  </div>
`;

// Add new task
document.getElementById("saveChanges").addEventListener("click", () => {
  const url = document.getElementById("imageUrl").value.trim();
  const title = document.getElementById("taskTitle").value.trim();
  const type = document.getElementById("tags").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!title || !description || !type) {
    alert("All fields are required!");
    return;
  }

  const newTask = {
    id: Date.now().toString(),
    url,
    title,
    description,
    type,
  };

  state.taskList.push(newTask);
  taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(newTask));

  document.getElementById("imageUrl").value = "";
  document.getElementById("taskTitle").value = "";
  document.getElementById("tags").value = "";
  document.getElementById("description").value = "";

  const addNewModal = bootstrap.Modal.getInstance(document.getElementById("addNewModal"));
  addNewModal.hide();
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
