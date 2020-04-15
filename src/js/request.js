import { userUrl} from "./vars";
import { getCookie } from "./cookie";
import { showAccount } from "./account";

export function getUserData(url) {
    return fetch(url)
        .then(response => response.json())
}

export function postData(url, userData) {
    return fetch ( url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify( userData )
    } ).then ( response => response.json() )
        .then(response => showAccount( response ) );
}

export function editTasks(url, userTasks) {
    return fetch ( userUrl(getCookie("login") ), {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify ({
            tasks: userTasks
        } )
    } )
}

export function deleteAccount(url) {
    return fetch( url , {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }).then ( response => response  )
}
