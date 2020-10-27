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

document.getElementById("password").oninput = function (event) {  checkPsw(event.target) }

function checkImg(img) {
    !img.files[0] ? null :
        img.files[0].size / 1024 > 300 ?  errorText (img,"The image is too big. Please upload up to 300kB") :
            img.files[0].type.split('/')[0] != "image" ?  errorText (img,"Not an image. Please upload only images") :
                showImgUploaded(img);
}

function showImgUploaded( img ) {
    errorText (img,"");
    let userPhoto = document.getElementById('user-photo');
    userPhoto.src = URL.createObjectURL(img.files[0]);
}

function checkPsw(psw) {
    psw.value === ""  ? errorText (psw, "This field is required") :
        psw.value.length < 8 ?   errorText (psw, "Password should contain at least 8 characters") :
            !psw.value.match(/[a-z]+/) ?  errorText (psw,"Password should contain at least 1 latin letter in a lower case" ):
                !psw.value.match(/[A-Z]+/) ?  errorText (psw, "Password should contain at least 1 latin letter in an upper case"):
                    !psw.value.match(/\d+/) ?  errorText (psw, "Password should contain at least 1 digit" ):
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


