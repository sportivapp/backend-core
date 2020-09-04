class NotFoundError extends Error {

    constructor(errorMsg) {
        super(errorMsg);
        this.name = 'NotFoundError'
    }
}

module.exports = NotFoundError