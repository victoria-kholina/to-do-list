import { isValid, imageBase64 } from "./validation";
import * as request  from "./request";
import {accountContainer, loginContainer, userUrl} from "./vars"
import { showAccount } from "./account";
import {errorText} from "./validation";
import {toggleDisplay} from "./toggle";
import {deleteAccount} from "./request";
import * as cookie from "./cookie";

// REGISTRATION FORM SUBMIT

document.getElementById("registration-btn").onclick= function (event) {
    const user = {};
    let avatar = document.getElementById("avatar"),
        login = document.getElementById("login"),
        password = document.getElementById("password"),
        tasks = [];

    if ( isValid( document.getElementById("registration-form") ) != false ) {
        !avatar.files[0] ? user[avatar.name] = false : user[avatar.name] = imageBase64;
        user[login.name] = login.value;
        let pswHash = Sha256.hash (password.value);
        user[password.name] = pswHash;
        user.tasks = tasks;
        request.postData( userUrl(login.value) , user)
    }
}

// SIGN IN
let formFields = document.getElementById("sign-in-form").getElementsByTagName("input");

document.getElementById("sign-in-btn").onclick = function (event) {
    let userLogin = document.getElementById("user-login"),
        userPsw = document.getElementById("user-password");

    for ( let field of formFields ) {
        field.value == "" ? errorText (field, "This field is required") : null  }

    if (userLogin.value)
    request.getUserData ( userUrl(userLogin.value) ).then( user => {
                user.login === userLogin.value ? user.password === Sha256.hash (userPsw.value) ? showAccount(user) :
                    errorText (document.getElementById("user-password"), "Password is wrong. Try again") :
                    errorText (userLogin, "Sorry, we can not find user with such login")
            } )
}

for(  let eye of document.getElementsByClassName("eye") ) {
    eye.onclick= function (event) {
        let inputPsw =event.target.nextElementSibling;
        inputPsw.type === "password" ?  inputPsw.type = "text" :  inputPsw.type = "password" ;
    }
}

// SIGN OUT
document.getElementById("sign-out").onclick = function (event) {
    toggleDisplay(loginContainer, accountContainer);
    document.cookie= `signed-out=true`;
}

// DELETE ACCOUNT
document.getElementById("delete-account").onclick = function (event) {
    deleteAccount( userUrl(cookie.getCookie("login")))
    cookie.removeCookie();
    for (let field of formFields)  { field.value = " " }
    toggleDisplay(loginContainer, accountContainer);
}

