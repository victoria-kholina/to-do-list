import { getCookie } from  './cookie'
import { preloader, setUserBinUrl, setUser, user, userBinUrl } from "./vars";
import * as request from "./request";
import {showAccount} from "./account";

getCookie("binID") ? checkifSignedOut() : preloader.style.display = "none";

function checkifSignedOut() { //on page upload we check if user signed out or no, if no we request all his data from database
    if( getCookie("signed-out" )) {
        document.getElementById("user-login").value = getCookie("login"); //set login from cookie into input field
        preloader.style.display = "none"
    } else {
        setUserBinUrl(getCookie("binID"))
         request.getUserData ( userBinUrl  ). then(result => {
             setUser( result );
             showAccount(user);
         })
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
setDocumentHeight();


