class InternalServerError extends Error {

    constructor(errorMsg) {
        super(errorMsg);
        this.name = 'InternalServerError'
    }
}

module.exports = InternalServerError