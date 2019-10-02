
const errors = []; //Erros dos inputs

const passwordLength = (password, min, max) => {
    if (password == null || password == "" || /^\s+$/.test(password) || password.length < min || password.length > max)
        return { result: false, msg: `Senha inválida. Tamanho mínimo de ${min} e máximo de ${max}` };
    return { result: true};
}

exports.user = (client) => {
    //Verificando se senha possui tamanho indicado
    let validPasswordLength = passwordLength(client.getPassword(), 6, 20);
    if (!validPasswordLength.result) {
        errors.push("password")
        errors['password'] = validPasswordLength.msg;
    }
    return errors;
}