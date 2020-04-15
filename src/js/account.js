import { accountContainer, loginContainer, preloader } from "./vars";
import { toggleDisplay,  toggleTasksDisplay } from "./toggle";
import { writeCookie } from "./cookie";
import { countTasks, addTask } from "./task";
import { startObserve } from "./observer";

export  let userData;

export function showAccount(user) {
    history.replaceState(null, null, " "); //cleaning hash (without #)
    userData = user;
    toggleDisplay( accountContainer ,loginContainer );
    user.avatar ? document.getElementById("user-avatar").src = userData.avatar : null

    document.getElementById("user-name").innerHTML = `Hello ${userData.login}`
    document.getElementById("date").innerText = new Date().toLocaleString('en-US', { dateStyle: 'medium' });
    startObserve(userData, document.getElementById("tasks"))

    for ( let userTask of userData.tasks ) {
        addTask( userTask.task, userTask.status, userTask.id )
    }

    toggleTasksDisplay("new")
    countTasks();
    writeCookie(user);
    preloader.style.display = "none"
}
