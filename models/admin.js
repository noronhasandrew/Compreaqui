const jwt = require("jsonwebtoken");
require('dotenv').config();

class Admin {

    constructor(client) {
        this._id;
        this._name = client.name;
        this._email = client.email;
        this._login = client.login;
        this._password = client.password;
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

    setAdress(adress) {
        this._adress = adress;
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
        return jwt.sign({ id: this.id, isAdmin: true }, process.env.SECRET, {
          expiresIn: 86400
        });
      }
}

module.exports = Admin;
