import * as vars from "./vars";
import { getCookie } from "./cookie";

export function getDB() {
    return fetch(vars.urlDB, {
        headers: {
            "secret-key": vars.secretKey
        }
    }).then(response => response.json())
}

export function getUserData( binUrl ) {
    return fetch(binUrl, {
        headers: {
            "secret-key": vars.secretKey
        }
    }).then(response => response.json())
}

export function updateData( url, data ) {
    return fetch ( url, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "secret-key":  vars.secretKey,
            "versioning":  false
            ///"name": userData.login
        },
        body: JSON.stringify(data )
    } )
}
export function createNewBin (userData) {
    return fetch ( vars.binRoot, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "secret-key":  vars.secretKey,
            "collection-id" : vars.collectionID,
             "name": userData.login
        },
        body: JSON.stringify(userData)
    } ).then(response => response.json())
}

export function deleteAccount(url) {
    return fetch( url , {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "secret-key": vars.secretKey
        }
    }).then ( response => response  )
}
