import {  toggleTasksDisplay  } from "./toggle";
import { user, userBinUrl } from"./vars"
import { errorText } from "./validation";
import { updateData } from "./request";

export function countTasks() {
    let tasksLength= document.getElementsByClassName("new").length;
    tasksLength == 0 ? document.getElementById("new-tasks-num").innerText = "no tasks" :
        tasksLength == 1 ? document.getElementById("new-tasks-num").innerText = tasksLength + " task" :
            document.getElementById("new-tasks-num").innerText = tasksLength + " tasks";
}


export function addTask(taskText, statusClass) {
    let htmlText = `<label class="task__mark">
                                    <input type="checkbox" >
                                    <span class="checkmark"></span>
                            </label>
                            <p class="task__text">${taskText}</p>
                            <img src="assets/img/close.svg" alt="remove task" class="task-close">`;

    let task = document.getElementById("tasks").insertAdjacentElement('afterbegin', document.createElement("li"));
    task.classList.add("task", statusClass);
    task.innerHTML = htmlText;
    task.setAttribute("id", setID() );
   return task;
}

export function removeTasks() {
    const parentTask = document.getElementById("tasks")
    while (parentTask.firstChild) {
        parentTask.removeChild(parentTask.firstChild)
    }
}

function cleanValue () {
    document.getElementById("new-task").value = "";
    document.getElementById("new-task").placeholder ="What is your task for today? ";
    countTasks();
}


document.getElementById("add-task").onclick = function (event) {
    let inputTask = document.getElementById("new-task");
    if (inputTask.value !== "")  {
        let newTask = addTask (inputTask.value, "new");
        if ( user ) {
            let userTasks =  user.tasks;
            userTasks.push( {
                id: newTask.getAttribute( "id"),
                task: inputTask.value,
                status: "new"
            } )
            console.log(user) ;
        }
        cleanValue ();
        errorText !== "" ? errorText (inputTask, " ") : null;
    } else {
        errorText (inputTask, "This field should not be empty.")
        return false;
    }
}

function setID() { //recursion
    let taskId = Math.floor(Math.random() * 10000 );

    for(  let task of document.getElementsByClassName("task") ) {
        if ( task.getAttribute("id") ===  taskId.toString() ) {
            setID();
        }  else  {
            return taskId.toString();
        }
    }
}
// FILTER TASKS
document.getElementById("all-tasks").onclick= function (event) {
    toggleTasksDisplay("task")
}
document.getElementById("to-do-tasks").onclick= function (event) {
    toggleTasksDisplay("new")
}
document.getElementById("done-tasks").onclick= function (event) {
    toggleTasksDisplay("done")
}

// SAVE CHANGES

document.getElementById("save-tasks").onclick= function (event) {
    event.target.disabled = true;
    updateData( userBinUrl, user ).then(result => {
        event.target.innerText = "Your tasks successfully saved" ;
        event.target.disabled = false;
    })
}

// REMOVE ALL TASKS

document.getElementById("close-all-tasks").onclick= function (event) {
        user.tasks = []
        updateData( userBinUrl, user ).then(result => console.log(result))
}

