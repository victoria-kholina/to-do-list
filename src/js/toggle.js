import {loginContainer, mainContainer } from "./vars";
import { removeTasks } from "./task";


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


