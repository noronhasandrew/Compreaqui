class Purchase {

    constructor(purchase) {
        this._id = purchase.id;
        this._date_hour = purchase.date_hour;
    }

    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
    }

    getdate_hour() {
        return this._date_hour;
    }

    setDate_Hour(date_hour) {
        this._date_hour = date_hour;
    }
}  

module.exports = Purchase;