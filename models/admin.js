const jwt = require("jsonwebtoken");
require('dotenv').config();

class Admin {

    constructor(admin) {
        this._id = admin.id;
        this._name = admin.name;
        this._email = admin.email;
        this._login = admin.login;
        this._password = admin.password;
    }

    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
    }

    getName() {
        return this._name;
    }

    setName(name) {
        this._name = name;
    }
    
    getAdress() {
        return this._adress;
    }

    getEmail() {
        return this._email;
    }

    setEmail(email) {
        this._email = email;
    }

    getLogin() {
        return this._login;
    }

    setLogin(login) {
        this._login = login;
    }

    getPassword() {
        return this._password;
    }

    setPassword(password) {
        this._password = password;
    }

    generateToken() {
        return jwt.sign({ userId: this._id, isAdmin: true }, process.env.SECRET, {
          expiresIn: 86400
        });
      }
}

module.exports = Admin;
