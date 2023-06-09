class Response {
    constructor(status,message , data) {
        this._status = status;
        this._message = message;
        this.data = data;
    }


    _status = "";
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }
    _message = "";
    get message() {
        return this._message;
    }
    set message(value) {
        this._message = value;
    }

    _data;
    get data() {
        return this._data;
    }
    set data(value) {
        this._data = value;
    }

    getJson() {
        return {
            "status" : this._status,
            "message" :this._message,
            "data" :this._data,
        }
    }

}

module.exports = Response;
