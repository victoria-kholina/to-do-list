import { isValid, imageBase64 } from "./validation";
import * as request  from "./request";
import {accountContainer,  loginContainer, setUser, setUserBinUrl, userBinUrl} from "./vars"
import { showAccount } from "./account";
import {errorText} from "./validation";
import {toggleDisplay} from "./toggle";
import {getCookie, writeCookie} from "./cookie";
import * as vars from "./vars";

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
        let database;
        request.getDB()
            .then(response => !response.users.find(user => user.login === login) ?
                                                database = response :
                                                    errorText(login, "Sorry, but this login is already occupied by another user. ")
        ).then(response => {
            if(database) {
                request.createNewBin(user)
                        .then(response => {
                            setUser(user);
                            setUserBinUrl(response.id);
                            writeCookie(user, response.id)
                    })
            }
        }).then(response => {
            const userMainData  = {
                login: getCookie("login"),
                binID:  getCookie("binID")
            }
            database.users.push(userMainData);
            request.updateData( vars.urlDB, database )
                .then( response => {
                    showAccount(user);
                })
        })
    }
}


// SIGN IN
let formFields = document.getElementById("sign-in-form").getElementsByTagName("input");

document.getElementById("sign-in-btn").onclick = function (event) {
    let userLogin = document.getElementById("user-login"),
        userPsw = document.getElementById("user-password");

    for ( let field of formFields ) {
        field.value == "" ? errorText (field, "This field is required") : null  }

    if ( getCookie("binID") ) {
        setUserBinUrl( getCookie("binID") );
        request.getUserData ( userBinUrl ).then((user)=> {
            if( user.login === userLogin.value) {
                checkPsw(user, user.password, userPsw.value)
            }  else {
                findUser(userLogin, userPsw);
            }
        })
    } else {
        findUser(userLogin, userPsw) ;
    }
}

function findUser(login, psw) {
    let binID;
    request.getDB().then(response => {
        let user = response.users.find(user => user.login === login.value);
        if (user) {
            binID = user.binID;
            errorText (login, " ");
        } else {
            errorText (login, "We can not find user with such login in our database");
        }
    }).then(response => {
        setUserBinUrl(binID);
        request.getUserData ( userBinUrl ).then((user)=> {
            setUser(user);
            checkPsw(user, user.password, psw.value , binID);
        });
    })
}

function checkPsw(user, pswInDB, userPsw, binID) {
    if( pswInDB === Sha256.hash (userPsw)) {
        !getCookie("binID") || getCookie("binID") != binID ? writeCookie(user, binID) : null;
        showAccount(user);
    } else {
        errorText (document.getElementById("user-password"), "Password is wrong. Try again")
    }
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
 //   TODO:  possibility to remove account
// // DELETE ACCOUNT
// document.getElementById("delete-account").onclick = function (event) {
//     deleteAccount( userUrl(cookie.getCookie("login")))
//     cookie.removeCookie();
//     for (let field of formFields)  { field.value = " " }
//     toggleDisplay(loginContainer, accountContainer);
// }

