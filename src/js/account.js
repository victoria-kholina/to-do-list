import { accountContainer, loginContainer, preloader } from "./vars";
import { toggleDisplay,  toggleTasksDisplay } from "./toggle";
import { emptyDate } from "./cookie";
import { countTasks, addTask } from "./task";
import { startObserve } from "./observer";


export function showAccount(user) {
    history.replaceState(null, null, " "); //cleaning hash (without #)
    toggleDisplay( accountContainer ,loginContainer );
    user.avatar ? document.getElementById("user-avatar").src = user.avatar : null

    document.getElementById("user-name").innerHTML = `Hello ${user.login}`
    document.getElementById("date").innerText = new Date().toLocaleString('en-US', { dateStyle: 'medium' });
    startObserve(user, document.getElementById("tasks"))

    for ( let userTask of user.tasks ) {
        addTask( userTask.task, userTask.status, userTask.id )
    }

    toggleTasksDisplay("new")
    countTasks();
    document.cookie = "signed-out=; expires=" + emptyDate;
    preloader.style.display = "none";
}
