const nullEmpty = (field) => {
    if (field == null || field == "") 
        return true;
    return false;
}

const testLogin = (login) => {
    if (!nullEmpty(login) || !(/^.{6,20}$/.test(login)))
        return { result: true };
    return { result: false, msg: 'Login inválido' };
}


const testName = (name) => {
    if (!nullEmpty(name) || /[^a-zà-ú]/gi.test(name))
        return { result: true };
    return { result: false, msg: 'Nome inválido' };
}

const testPassword = (password, min, max) => {
    if (!nullEmpty(password) || /^\s+$/.test(password) || password.length > min || password.length < max)
        return { result: true };
    return { result: false, msg: `Senha inválida. Tamanho mínimo de ${min} e máximo de ${max}` };
}

const testEmail = (email) => {
    if (!nullEmpty(email))
        return { result: true };
    return { result: false, msg: 'Email inválido' };
}

const testAdress = (adress) => {
    if (!nullEmpty(adress))
        return { result: true };
    return { result: false, msg: 'Endereço inválido' };
}

exports.user = (user) => {

    const errors = []; //Erros dos inputs

    let validPassword = testPassword(user.getPassword(), 6, 20);
    let validEmail = testEmail(user.getEmail());
    let validName = testName(user.getName());
    let validLogin = testLogin(user.getLogin())

    if (user.getAdress() != undefined) {
        let validAdress = testAdress(user.getAdress());
        if (!validAdress.result) {
            errors.push("adress")
            errors['adress'] = validAdress.msg;
        }
    }

    if (!validPassword.result) {
        errors.push("password")
        errors['password'] = validPassword.msg;
    }

    if (!validEmail.result) {
        errors.push("email")
        errors['email'] = validEmail.msg;
    }

    if (!validName.result) {
        errors.push("name")
        errors['name'] = validName.msg;
    }

    if (!validLogin.result) {
        errors.push("login")
        errors['login'] = validLogin.msg;
    }

    return errors;
}