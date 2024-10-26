const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const message = document.querySelector(".welcome h2");
const previewPhotoDiv = document.getElementById("profile-photo");
const uploadPhoto = document.getElementById("upload");

let profilePhoto;

function prevPage() {
    page2.style.display = "none";
    page1.style.display = "flex";

    message.innerHTML = `Realize seu cadastro`;
}

function previewImage() {
    const file = uploadPhoto.files[0];

    if (!file.type.includes("image")) {
        previewImage.style.border = "2px solid red";

        return;
    }

    const cropContainer = document.querySelector(".crop-container");

    cropContainer.style.display = "flex";

    const image = document.getElementById('crop-profile');

    const fileUrl = URL.createObjectURL(file);

    image.src = fileUrl;

    const cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 0,
        dragMode: 'move',
        movable: true,
        zoomable: true,
        scalable: false,
        rotatable: false,
        cropBoxResizable: true,
        background: false
    });


    function crop() {
        const croppedImage = cropper.getCroppedCanvas({
            with: 300,
            heigth: 300
        });

        const croppedImageUrl = croppedImage.toDataURL('image/png');

        previewPhotoDiv.style.backgroundImage = `url(${croppedImageUrl})`;

        cropContainer.style.display = "none";

        document.removeEventListener("click", crop);
        cropper.destroy();

        uploadPhoto.value = "";
    }

    document.getElementById("save-profile").addEventListener("click", crop);
    document.getElementById("cancel-profile").addEventListener("click", cancel);
}


uploadPhoto.addEventListener("change", previewImage);

// Validações Padrão

function validateText(validCharacters, text) {
    if (text.length === 0) return false;


    for (let i = 0; i < text.length; i++) {
        if (!validCharacters.includes(text[i])) {
            return false;
        }
    }

    return true;
}

function containsUpperCase(text) {
    return text.toLowerCase() != text;
}


function containsLowerCase(text) {
    return text.toUpperCase() != text;
}


function containsNumber(text) {
    for (let i = 0; i < text.length; i++) {
        if ("1234567890".includes(text[i])) {
            return true;
        }
    }

    return false;
}

function containsJustNumbers(text) {
    return !isNaN(Number(text));
}


function containsSpecialCharacter(text) {
    for (let i = 0; i < text.length; i++) {
        if (`!@#$%^&*()_+-={}[]|\\:"';<>,./?`.includes(text[i])) {
            return true;
        }
    }

    return false;
}

function removeInvalidCharacters(input, validCharacters, trim = false) {
    let text = "";
    for (let i = 0; i < input.value.length; i++) {
        if (validCharacters.includes(input.value[i])) {
            text += input.value[i];
        }
    }

    if (trim) {
        text.trim();
    }

    input.value = text;
}

// Validações de Campos

function validateName() {
    const name = document.getElementById("name");
    const error = document.getElementById("error-name");

    error.innerHTML = "";

    if (containsNumber(name.value) || containsSpecialCharacter(name.value)) {
        error.innerHTML = "Nome não pode conter números ou caracteres especiais.";
    }


    removeInvalidCharacters(name, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ");

    if (name.value.length < 5) {
        error.innerHTML = "Nome deve conter pelo menos 5 caracteres."

        return false;
    }

    return true;
}

function validateEmail() {
    const email = document.getElementById("email");
    const error = document.getElementById("error-email");

    error.innerHTML = "";

    email.value = (email.value).toLowerCase();

    if (
        (!email.value.includes("@") || !email.value.includes(".")) ||
        (email.value.indexOf("@") > email.value.lastIndexOf(".")) ||
        (!email.value[email.value.lastIndexOf(".") + 1])
    ) {
        error.innerHTML = "O formato do email é inválido.";
        return false;
    }

    return true;
}

function validatePass() {
    const pass = document.getElementById("pass").value;
    const error = document.getElementById("error-pass");

    error.innerHTML = "";

    let valid = true;

    if (!containsLowerCase(pass)) {
        error.innerHTML = "A senha deve conter ao menos uma letra minúscula";
        valid = false;
    }

    else if (!containsUpperCase(pass)) {
        error.innerHTML = "A senha deve conter ao menos uma letra maiúscula";
        valid = false;
    }

    else if (!containsNumber(pass)) {
        error.innerHTML = "A senha deve conter ao menos um número";
        valid = false;
    }

    else if (containsJustNumbers(pass)) {
        error.innerHTML = "A senha precisa conter letras";
        valid = false;
    }

    else if (pass.length < 6) {
        error.innerHTML = "A senha precisa conter ao menos 6 dígitos";
        valid = false;
    }


    return valid;
}


function validateConfirm() {
    const pass = document.getElementById("pass").value;
    const confirm = document.getElementById("confirmPass").value;
    const error = document.getElementById("error-confirm");

    error.innerHTML = "";

    if (confirm !== pass) {
        error.innerHTML = "As senhas não coincidem";

        return false;
    }

    return true;
}

function nextPage() {
    const validName = validateName();
    const validEmail = validateEmail();
    const validPass = validatePass();
    const validConfirm = validateConfirm();

    if (validName && validEmail && validPass && validConfirm) {
        page1.style.display = "none";
        page2.style.display = "flex";

        message.innerHTML = `Vamos finalizar seu perfil...`;
    }
}