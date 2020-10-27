import * as request  from "./request";
import { showAccount } from "./account";
import {errorText} from "./validation";
import {toggleDisplay} from "./toggle";
import {getCookie, removeCookie, writeCookie} from "./cookie";
import * as vars from "./vars";

// SIGN IN
let formFields = document.getElementById("sign-in-form").getElementsByTagName("input");

document.getElementById("sign-in-btn").onclick = function (event) {
    let userLogin = document.getElementById("user-login"),
        userPsw = document.getElementById("user-password");

    for ( let field of formFields ) {
        field.value == "" ? errorText (field, "This field is required") : null  }

    if ( getCookie("binID") ) {  //here we check if there is binID in cookie, that we can use for access to user bin.
        vars.setUserBinUrl( getCookie("binID") );
        request.getUserData ( vars.userBinUrl ).then((user)=> {
            user.login === userLogin.value ?  checkPsw(user, user.password, userPsw.value) :  findUser(userLogin, userPsw)
        })
    } else {
        findUser(userLogin, userPsw) ;
    }
}

function findUser(login, psw) { //here we request bin with DB to check if there is user with login in input, but did not found in cookie
    let user;
    request.getDB().then(response => {
        user = response.find(user => user.login === login.value);
        }).then(response => {
            if (user) {
                let binID = user.binID;
                errorText (login, "");
                vars.setUserBinUrl(binID);
                request.getUserData ( vars.userBinUrl ).then((user)=> {
                    vars.setUser(user);
                    !getCookie("binID") || getCookie("binID") != binID ? writeCookie(user, binID) : null; //there cases when cookie with binID did not found at all. OR found but did not match the one in DB.
                    checkPsw(user, user.password, psw.value );
                });
            } else {
                errorText (login, "We can not find user with such login in our database");
            }
        })
}

function checkPsw(user, pswInDB, userPsw) {
    pswInDB === Sha256.hash (userPsw) ?
                                        showAccount(user) :
                                            errorText (document.getElementById("user-password"), "Password is wrong. Try again")
}

for(  let eye of document.getElementsByClassName("eye") ) {
    eye.onclick= function (event) {
        let inputPsw =event.target.nextElementSibling;
        inputPsw.type === "password" ?  inputPsw.type = "text" :  inputPsw.type = "password" ;
    }
}

// SIGN OUT
document.getElementById("sign-out").onclick = function (event) {
    toggleDisplay(vars.loginContainer, vars.accountContainer);
    document.cookie= `signed-out=true`;
}


// REMOVE ACCOUNT
document.getElementById("delete-account").onclick = function (event) {
    let dbWithUserRemoved;
    request.getDB()
        .then(response =>  {
                dbWithUserRemoved = response.filter(user => user.login  !== getCookie("login"));

            }).then( response => {
                    request.removeBin(vars.userBinUrl).then(response => {
                        request.updateData( vars.urlDB, dbWithUserRemoved )

                            .then( response => {
                                removeCookie();
                                for (let field of formFields)  { field.value = "" }
                                toggleDisplay(vars.loginContainer, vars.accountContainer);
                            })
                    })
                })
}

for (let field of formFields)  {
    field.onchange = function ( event ) {
        if (event.target.nextElementSibling.innerText != "") errorText(event.target, "");
    }
}