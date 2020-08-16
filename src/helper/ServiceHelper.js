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

function toEmptyPage(page, size) {
    const paging = {
        page: page,
        size: size,
        totalSize: 0,
        totalPage: 1
    }
    return {
        data: [],
        paging: paging
    }
}

module.exports = { toPageObj, toEmptyPage }