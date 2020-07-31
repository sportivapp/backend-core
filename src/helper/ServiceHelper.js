function toPageObj(page, size, pageObj) {
    const paging = {
        page: page,
        size: size,
        totalSize: pageObj.total,
        totalPage: Math.ceil(pageObj.total / size)
    }
    return {
        data: pageObj.results,
        paging: paging
    }
}

module.exports = { toPageObj }