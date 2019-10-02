class Product {

    constructor(product) {
        this._id;
        this._name = product.name;
        this._description = product.description;
        this._amount = product.amount;
        this._price = product.price;
        this._photo = product.photo;
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

    getamount() {
        return this._amount;
    }

    setamount(amount) {
        this._amount = amount;
    }

    getDescription() {
        return this._description;
    }

    setDescription(description) {
        this._description = description;
    }

    getPrice() {
        return this._price;
    }

    setPrice(price) {
        this._price = price;
    }

    getPhoto() {
        return this._photo;
    }

    setPhoto(photo) {
        this._photo = photo;
    }

}

module.exports = Product;
