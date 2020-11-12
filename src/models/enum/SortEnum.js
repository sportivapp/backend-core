module.exports = {
    NEWEST: 'NEWEST',
    OLDEST: 'OLDEST',
    POPULAR: 'POPULAR',

    typeOf(name) {
        return this.NEWEST === name || this.OLDEST === name || this.POPULAR === name
    }
}