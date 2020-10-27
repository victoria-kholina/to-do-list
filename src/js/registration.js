import { isValid, imageBase64 } from "./validation";
import * as request  from "./request";
import { setUser, setUserBinUrl } from "./vars"
import { showAccount } from "./account";
import {errorText} from "./validation";
import {writeCookie} from "./cookie";
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
        let pswHash = Sha256.hash (password.value); //creating hash of password
        user[password.name] = pswHash;
        user.tasks = tasks;

        let database; //we will work with this variable
        request.getDB()
            .then(response => !response.find(user => user.login === login) ? // check if in DB no any user with such login
                database = response :
                errorText(login, "Sorry, but this login is already occupied by another user. ")
            ).then(response => {
            if( database ) {
                let userBinID;
                request.createNewBin(user) // if we didn`t find user with the same login, we can register new one.
                    .then(response => { // This request creates a special BIN for user - it is like a BOX
                        setUser(user);
                        userBinID = response.id; //this request returns binID of just created bin - we need it for access to user bin
                        setUserBinUrl(userBinID );
                        writeCookie(user, userBinID );
                    }).then(response => { //we should write only binID and login to separate bin, named database.
                    const userMainData  = { // So Database - it is just separate box with keys to user info
                        login: login.value,
                        binID:  userBinID
                    }
                    database.push(userMainData);
                    request.updateData( vars.urlDB, database ) // Database updated with new user
                        .then( response => {
                            showAccount(user);
                        })
                })
            }
        })
    }
}