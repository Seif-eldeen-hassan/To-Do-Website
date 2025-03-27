let input_box = document.querySelector(".to_do_input");
let tasks = document.querySelector(".tasks");
let active_bt = document.querySelector("#active");
let all_bt = document.querySelector("#all");
let completed_bt = document.querySelector("#completed");
let items_number = document.querySelector(".items_number");
let clear_bt =  document.querySelector(".clear")
let mode_icon = document.querySelector(".mode_icon")
let upper_page = document.querySelector(".upper_page")
let input_container = document.querySelector(".to_do_input")
let task_footer = document.querySelector(".task_footer")
let light_mode = true;
let draggedIndex = null;

let tasks_data = [];

//  Load data from localStorage when page loads
function load_data() {
    let stored_tasks = localStorage.getItem("tasks");
    if (stored_tasks) {
        tasks_data = JSON.parse(stored_tasks);
    }
    update_items_count();
    render_tasks();
}

//  Save tasks to localStorage
function save_data() {
    try {
        localStorage.setItem("tasks", JSON.stringify(tasks_data));
    } catch (e) {
        console.error("LocalStorage Error:", e);
    }
}

//  Create a task element and add it to the UI
function createTaskElement(taskData, index) {
    let task = document.createElement("div");
    let line = document.createElement("hr");
    line.classList.add("line")
    task.setAttribute("draggable", "true");
    task.classList.add("task");
    task.innerHTML = `
    ${taskData.status === 'Completed' ? `<img src="./images/icon-check.svg" class="check_icon">` : '<div class="empty_circle"></div>'}
    <h1 class="task_discription">${taskData.text}</h1>
    <img src="./images/icon-cross.svg" class="remove">
    `;

    // Drag and Drop Event Listeners
    task.addEventListener("dragstart", (e) => dragStart(e, index));
    task.addEventListener("dragover", (e) => dragOver(e));
    task.addEventListener("drop", (e) => dropTask(e, index));

    let emptyCircle = task.querySelector(".empty_circle");
    let input_circle = document.querySelector("#input_circle")
    let clear = document.querySelector(".clear")
    let items_number = document.querySelector(".items_number");
    let task_discription =  task.querySelector(".task_discription")
    if(light_mode){
        task.style.backgroundColor = "hsl(0, 0.00%, 100.00%)";
        if(taskData.status === 'Completed'){
            task_discription.classList.add("checked_discription_light")
        }
        
        line.style.border = "1px solid hsl(236, 33%, 92%,0.5)";
        if (emptyCircle) {
            emptyCircle.style.border = "1px solid hsl(233, 11%, 84%)";
        }
        input_circle.style.border = "1px solid hsl(233, 11%, 84%)";
        clear.style.color = "hsl(235, 19%, 35% , 0.4)";
        items_number.style.color = "hsl(235, 19%, 35% , 0.4)";
    
    }
    else{
        
        task.style.backgroundColor = "hsl(235, 24%, 19%)"; 
        if(taskData.status === 'Completed'){
            task_discription.classList.add("checked_discription_dark")
        }
        task.querySelector(".task_discription").style.color = "hsl(234, 24.60%, 77.60%)";
        line.style.border = "1px solid hsl(236, 33%, 92%,0.07)";
        if (emptyCircle) {
            emptyCircle.style.border = "1px solid hsl(240, 24%, 93%, 0.09)";
        }
        input_circle.style.border = "1px solid hsl(240, 24%, 93%, 0.09)";
        clear.style.color = "hsl(234, 11%, 52%,0.7)";
        items_number.style.color = "hsl(234, 11%, 52%,0.7)";
    }

    // Add event listener to mark task as completed
    task.addEventListener("click", function () {
        check_task(index);
    });

    //  Add event listener to remove task
    let remove_btn = task.querySelector(".remove");
    remove_btn.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevents click from marking task as completed
        remove_task(index);
    });

    tasks.append(task);
    tasks.append(line);
}

//  Render all tasks from tasks_data array
function render_tasks() {
    tasks.innerHTML = ""; // Clear tasks list

    tasks_data.forEach((taskData, index) => {
        createTaskElement(taskData, index);
    });

    all_bt.classList.add("choosed_category");
    active_bt.classList.remove("choosed_category");
    completed_bt.classList.remove("choosed_category");
  
}

//  Add a new task
function AddTask(task_text) {
    if (!task_text.trim()) return; // Ignore empty input

    let task_data = {
        text: task_text,
        status: "Active",
    };

    tasks_data.push(task_data);
    save_data();
    update_items_count();
    render_tasks();
}

// Toggle task status (Active ↔ Completed)
function check_task(index) {
    if (tasks_data[index].status === "Active") {
        tasks_data[index].status = "Completed";
    } else {
        tasks_data[index].status = "Active";
    }

    save_data();
    update_items_count();
    render_tasks();
}

// Filter and display only active tasks
function display_Active() {
    tasks.innerHTML = ""; // Clear list

    tasks_data.forEach((taskData, index) => {
        if (taskData.status === "Active") {
            createTaskElement(taskData, index);
        }
    });

    all_bt.classList.remove("choosed_category");
    active_bt.classList.add("choosed_category");
    completed_bt.classList.remove("choosed_category");
}

// Filter and display only completed tasks
function display_completed() {
    tasks.innerHTML = ""; // Clear list

    tasks_data.forEach((taskData, index) => {
        if (taskData.status === "Completed") {
            createTaskElement(taskData, index);
        }
    });

    all_bt.classList.remove("choosed_category");
    active_bt.classList.remove("choosed_category");
    completed_bt.classList.add("choosed_category");
}

// Update "items left" counter
function update_items_count() {
    let total = tasks_data.filter(task => task.status === "Active").length;
    items_number.innerText = `${total} items left`;
}

// Remove a task
function remove_task(index) {
    tasks_data.splice(index, 1);
    save_data();
    update_items_count();
    render_tasks();
}

// Handle Enter key to add task
input_box.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        let task_text = input_box.value.trim();
        if (task_text) {
            AddTask(task_text);
            input_box.value = "";
        }
    }
});

function clear_completed() {
    tasks_data = tasks_data.filter(task => task.status !== "Completed"); // Keep only "Active" tasks
    save_data();
    update_items_count();
    render_tasks();
}


function dragStart(event, index) {
    draggedIndex = index;
    event.dataTransfer.effectAllowed = "move";
}

function dragOver(event) {
    event.preventDefault(); // allow dropping
}

function dropTask(event, newIndex) {
    event.preventDefault();
    if (draggedIndex === newIndex) return; // Avoid unnecessary swaps

    // Swap tasks in tasks_data
    let temp = tasks_data[draggedIndex];
    tasks_data.splice(draggedIndex, 1);
    tasks_data.splice(newIndex, 0, temp);

    save_data();
    render_tasks(); 
}


function change_mode(){
    if(light_mode){
        upper_page.style.backgroundImage = "url('./images/bg-desktop-dark.jpg')";
        document.documentElement.style.backgroundColor = "hsl(235, 21%, 11%)"; 
        document.body.style.backgroundColor = "hsl(235, 21%, 11%)"; 
        mode_icon.setAttribute("src","./images/icon-sun.svg")
        input_container.style.backgroundColor = "hsl(235, 24%, 19%)";
        input_container.style.color = "hsl(234, 39%, 85%)";
        tasks.style.backgroundColor = "hsl(235, 24%, 19%)";
        task_footer.style.backgroundColor = "hsl(235, 24%, 19%)";
        light_mode = false;
        render_tasks();
    }
    else{
        upper_page.style.backgroundImage = "url('./images/bg-desktop-light.jpg')";
        document.body.style.backgroundColor = "hsl(0, 0%, 98%)";
        document.documentElement.style.backgroundColor = "hsl(0, 0%, 98%)"; 
        mode_icon.setAttribute("src","./images/icon-moon.svg")
        input_container.style.backgroundColor = "white";
        input_container.style.color = "hsl(235, 19%, 35%)";
        tasks.style.backgroundColor = "hsl(0, 0.00%, 100.00%)";
        task_footer.style.backgroundColor = "hsl(0, 0.00%, 100.00%)";    
        light_mode = true;
        
        render_tasks();
        
    }
   
}

// Load tasks on page load
window.addEventListener("load", load_data);

// Add event listeners for filter buttons
all_bt.addEventListener("click", render_tasks);
active_bt.addEventListener("click", display_Active);
completed_bt.addEventListener("click", display_completed);
clear_bt.addEventListener("click",clear_completed);
mode_icon.addEventListener("click",change_mode)
