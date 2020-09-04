class UnsupportedOperationError extends Error {

    constructor(errorMsg) {
        super(errorMsg);
        this.name = 'UnsupportedOperationError'
    }
}

module.exports = UnsupportedOperationError