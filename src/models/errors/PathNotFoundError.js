class PathNotFoundError extends Error {

    constructor(errorMsg) {
        super(errorMsg);
        this.name = 'PathNotFoundError'
    }
}

module.exports = PathNotFoundError