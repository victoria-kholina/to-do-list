import {  toggleTasksDisplay  } from "./toggle";
import { userData } from "./account";
import * as request from "./request";
import { userUrl } from "./vars";
import { errorText } from "./validation";

export function countTasks() {
    let tasksLength= document.getElementsByClassName("new").length;
    tasksLength == 0 ? document.getElementById("new-tasks-num").innerText = "no tasks" :
        tasksLength == 1 ? document.getElementById("new-tasks-num").innerText = tasksLength + " task" :
            document.getElementById("new-tasks-num").innerText = tasksLength + " tasks";
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

export function addTask(taskText, statusClass, taskID) {
    let htmlText = `<label class="task__mark">
                                    <input type="checkbox" >
                                    <span class="checkmark"></span>
                            </label>
                            <p class="task__text">${taskText}</p>
                            <img src="../assets/img/close.svg" alt="remove task" class="task-close">`;


    let task = document.getElementById("tasks").insertAdjacentElement('afterbegin', document.createElement("li"));
    task.classList.add("task", statusClass);
    task.setAttribute("id", taskID );
    task.innerHTML = htmlText;
 
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
        let newID =setID();
        let newTask = addTask (inputTask.value, "new", newID );
        if ( userData ) {
            let userTasks =  userData.tasks;
            userTasks.push( {
                id: newTask.getAttribute( "id"),
                task: inputTask.value,
                status: "new"
            } )
        }
        cleanValue ();
        errorText !== "" ? errorText (inputTask, " ") : null;
    } else {
        errorText (inputTask, "This field should not be empty.")
        return false;
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
    request.editTasks( userUrl(userData.login)  , userData.tasks)
        .then(result => event.target.innerText = "Your tasks successfully saved")
}

// REMOVE ALL TASKS

document.getElementById("close-all-tasks").onclick= function (event) {
        userData.tasks = []
        removeTasks();
}

