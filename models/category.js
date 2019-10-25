class Category {

    constructor(category) {
        this._id = category.id
        this._name = category.name;
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
}  

module.exports = Category;