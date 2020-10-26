import { isValid, imageBase64 } from "./validation";
import * as request  from "./request";
import {accountContainer,  loginContainer, setUser, setUserBinUrl, userBinUrl} from "./vars"
import { showAccount } from "./account";
import {errorText} from "./validation";
import {toggleDisplay} from "./toggle";
import {getCookie, removeCookie, writeCookie} from "./cookie";
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
            .then(response => !response.find(user => user.login === login) ?
                                                database = response :
                                                    errorText(login, "Sorry, but this login is already occupied by another user. ")
                ).then(response => {
                    if(database) {
                        let userBinID;
                        request.createNewBin(user)
                                .then(response => {
                                    setUser(user);
                                    userBinID = response.id;
                                    setUserBinUrl(userBinID );
                                    writeCookie(user, userBinID )
                                    }).then(response => {
                                            const userMainData  = {
                                                login: login.value,
                                                binID:  userBinID
                                            }
                                            database.push(userMainData);
                                            request.updateData( vars.urlDB, database )
                                                .then( response => {
                                                    showAccount(user);
                                                })
                                        })
                    }
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
            user.login === userLogin.value ?  checkPsw(user, user.password, userPsw.value) :  findUser(userLogin, userPsw)
        })
    } else {
        findUser(userLogin, userPsw) ;
    }
}

function findUser(login, psw) {
    let user;
    request.getDB().then(response => {
        user = response.find(user => user.login === login.value);
        }).then(response => {
            if (user) {
                let binID = user.binID;
                errorText (login, "");
                setUserBinUrl(binID);
                request.getUserData ( userBinUrl ).then((user)=> {
                    setUser(user);
                    !getCookie("binID") || getCookie("binID") != binID ? writeCookie(user, binID) : null;
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
    toggleDisplay(loginContainer, accountContainer);
    document.cookie= `signed-out=true`;
}


// REMOVE ACCOUNT
document.getElementById("delete-account").onclick = function (event) {
    let dbWithUserRemoved;
    request.getDB()
        .then(response =>  {
                dbWithUserRemoved = response.filter(user => user.login  !== getCookie("login"));

            }).then( response => {
                    request.removeBin(userBinUrl).then(response => {
                        request.updateData( vars.urlDB, dbWithUserRemoved )

                            .then( response => {
                                removeCookie();
                                for (let field of formFields)  { field.value = "" }
                                toggleDisplay(loginContainer, accountContainer);
                            })
                    })
                })
}

for (let field of formFields)  {
    field.onchange = function ( event ) {
        if (event.target.nextElementSibling.innerText != "") errorText(event.target, "");
    }
}