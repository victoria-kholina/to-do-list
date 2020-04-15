import {loginContainer, mainContainer} from "./vars";
import { countTasks, removeTasks } from "./task";

export function toggle( elemToShow, elemToHide) {

}

export function toggleDisplay(elemShow, elemHide ) {   // Animation trigger
    elemShow.style.display = "grid";
    elemHide.style.display = "none";
    if( elemShow == loginContainer ) {
        removeTasks();
        mainContainer.classList.add("login")
    } else {
        mainContainer.classList.remove("login")
    }
}

export function toggleTaskState(checkMark) {
    let state;
    let parentBox = checkMark.parentElement.parentElement;
    if( parentBox .classList.contains("new") ) {
        parentBox.classList.remove("new");
        parentBox.classList.add("done");
        state =  "done";
    } else if (parentBox.classList.contains("done")) {
        parentBox.classList.remove("done");
        parentBox.classList.add("new");
        state =  "new";
    }
    countTasks()
    return state;
}

export function toggleTasksDisplay( tasksToShow) {
    for(  let task of document.getElementsByClassName("task") ) {
        task.style.display = "none";
        if ( task.classList.contains(tasksToShow) ) {
            task.style.display = "flex";
        }
    }
}
