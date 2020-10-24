
export let user;
export function setUser(userData) {
    user =  userData;
}
export let userBinUrl ;
export function setUserBinUrl (binId) {
    userBinUrl = `${ binRoot }/${ binId }`;
}

export const preloader = document.getElementById("preloader"),
                      mainContainer = document.getElementById("login-page"),
                      loginContainer = document.getElementById("login-container"),
                      accountContainer = document.getElementById("account-container"),
                      binRoot = "https://api.jsonbin.io/b",
                      collectionID = "5f1acd08c58dc34bf5d9cd33",
                      secretKey = "$2b$10$pDq3QtKfrwesrxwQ59aWIOvaglvZRlTC5HODRHABUQ/1xwYjGf.1m",
                      urlDB = "https://api.jsonbin.io/b/5f3ea46bb88c04101cf83396";



