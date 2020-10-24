import * as request  from "./request";
import {userUrl} from "./vars";


// getting image from obj in base64
export let imageBase64;
document.getElementById("avatar").onchange = function (event) {
    checkImg(event.target)
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0])
    reader.onload = function (ev) {
        imageBase64 = ev.target.result;
    }
}

// setting Error text
export function errorText (input, message) {
    return input.nextElementSibling.innerText = message;
}

// // check if in db is the same login
// document.getElementById("login").onchange = function (event) {
//     if( event.target.value ) {
//         request.getUserData ( event.target.value )
//             .then( response => {
//                !response.error ? errorText (event.target,"Sorry, but this login is already occupied by another user. ") : errorText (event.target,"")
//             })
//     } else {
//         errorText(event.target, "This field is required")
//     }
// }

document.getElementById("password").oninput = function (event) {  checkPsw(event.target) }

function checkImg(img) {
    !img.files[0] ? null :
        img.files[0].size / 1024 > 300 ?  errorText (img,"Big size of image. Please upload max 300kB") :
            img.files[0].type.split('/')[0] != "image" ?  errorText (img,"Not an image. Please upload only images") :
                showImgUploaded(img);
}

function showImgUploaded( img ) {
    errorText (img,"");
    let userPhoto = document.getElementById('user-photo');
    userPhoto.src = URL.createObjectURL(img.files[0]);
}

function checkPsw(psw) {
    psw.value === ""  ? errorText (psw, "This field is required.") :
        psw.value.length < 8 ?   errorText (psw, "Password should contain as minimum 8 characters") :
            !psw.value.match(/[a-z]+/) ?  errorText (psw,"Password should contain as minimum 1 latin letter in low register" ):
                !psw.value.match(/[A-Z]+/) ?  errorText (psw, "Password should contain as minimum 1 latin letter in upper register"):
                    !psw.value.match(/\d+/) ?  errorText (psw, "Password should contain as minimum 1 digit" ):
                        errorText (psw, "");
}

export function isValid(form) {
    const formInputs = form.getElementsByTagName("input");
    for (let inputElem of formInputs) {
        inputElem.id == "login" ? inputElem.value === "" ? errorText (inputElem,"This field is required.") : false :
            inputElem.id == "avatar" ?  checkImg(inputElem)  :
                inputElem.id == "password" ? checkPsw(inputElem) : false

        if (inputElem.nextElementSibling.textContent.length != 0)  var formValid = false ;
    }
    return formValid;
}

// end Validation


