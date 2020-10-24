import {toggleTaskState} from "./toggle";
import {countTasks} from "./task";

export function startObserve(user, elem) {
    let observer = new MutationObserver (
        function ( mutations ) {
            mutations.forEach(
                function ( mutation ) {

                    // REMOVE TASK
                    for( let elem of document.getElementsByClassName("task-close")) {
                        elem.onclick = function (event) {
                            let taskIndex = user.tasks.findIndex( task => task.id === event.target.parentElement.getAttribute("id"))
                            user.tasks.splice(taskIndex, 1);
                            event.target.parentNode.remove();
                            countTasks();
                        }
                    }
                    // CHANGE STATUS OF TASK
                    for(  let checkMark of document.getElementsByClassName("checkmark") ) {
                        checkMark.onclick = function (event) {
                            let taskEdited = event.target.parentElement.parentElement;
                            let currTask = user.tasks.find( task=> task.id === taskEdited.getAttribute("id"))
                            currTask.status = toggleTaskState(event.target);
                        }
                    }
                }
            )
        }
    )
    let config = {
        childList: true
    }

    observer.observe ( elem, config );
}