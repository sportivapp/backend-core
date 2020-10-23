class UnauthorizedError extends Error {

    constructor(errorMsg) {
        super(errorMsg);
        this.name = 'UnauthorizedError'
    }
}

module.exports = UnauthorizedError