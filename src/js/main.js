import * as cookie from  './cookie'
import {preloader, userUrl} from "./vars";
import * as request from "./request";
import {showAccount} from "./account";

export let requestUserData = request.getUserData ( userUrl(cookie.getCookie("login")) );

cookie.getCookie("login") ? checkifSignedOut() : preloader.style.display = "none";

function checkifSignedOut() {
    if( cookie.getCookie("signed-out" )) {
        document.getElementById("user-login").value = cookie.getCookie("login") //set login from cookie into input field
        preloader.style.display = "none"
    } else {
        requestUserData.then ( user => user.error ? cookie.removeCookie() :
            user.password === cookie.getCookie("psw") ? showAccount(user) :
                console.log("psw different in db and cookie")
        )
    }
}

( function () {
    let quotes = document.getElementsByClassName("quote");
    let randomInt = Math.floor(Math.random() * quotes.length ) ;
    quotes[randomInt].style.display ="flex";
})()

function setDocumentHeight() {
    if( window.innerHeight > 500 ) {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`)
    }
};

window.addEventListener("resize", setDocumentHeight);
window.addEventListener('orientationchange', setDocumentHeight)
setDocumentHeight()


