import { toggleDisplay } from "./toggle";
import {loginContainer, accountContainer} from "./vars";

export let emptyDate = new Date ( 0 ).toUTCString ();

export function writeCookie(user, binID) {
    document.cookie = `login=${user.login}`;
    document.cookie = `binID=${ binID }`;
    document.cookie = "signed-out=; expires=" + emptyDate;
}

export function getCookie(key) {
    let cookieValue;
    document.cookie.split("; ")
        .map(item => item.split("="))
        .map(item =>  item[0] === key ? cookieValue = item[1] : null )
    return cookieValue;
}

export function removeCookie() {
    document.cookie = "login=; expires=" + emptyDate;
    document.cookie = "binID=; expires=" + emptyDate;
    document.cookie = "signed out=; expires=" + emptyDate;
    toggleDisplay( loginContainer, accountContainer );
}


