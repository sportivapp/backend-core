function toBaseResponse(data) {
    return {
        code: 200,
        status: "OK",
        data: data
    }
}

function toPageResponse(data, paging) {
    return {
        code: 200,
        status: "OK",
        data: data,
        paging: paging
    }
}

function toErrorResponse(code) {
    let status
    switch (code) {
        case 400:
            status = "BAD_REQUEST"
            break
        case 403:
            status = "FORBIDDEN"
        case 404:
            status = "NOT_FOUND"
            break
        case 500:
            status = "INTERNAL_SERVER_ERROR"
            break
        default:
            status = "INTERNAL_ERROR"
    }

    return {
        code: code,
        status: status
    }
}

module.exports = { toBaseResponse, toPageResponse, toErrorResponse }