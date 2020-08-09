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

function toErrorResponse(code, error) {
    let status
    switch (code) {
        case 400:
            status = "BAD_REQUEST"
            break
        case 403:
            status = "FORBIDDEN"
            break
        case 404:
            status = "NOT_FOUND"
            break
        case 500:
            status = "INTERNAL_SERVER_ERROR"
            break
        default:
            status = "INTERNAL_ERROR"
    }

    const response = {
        code: code,
        status: status
    }

    return error ? { ...response, errors: error } : response
}

module.exports = { toBaseResponse, toPageResponse, toErrorResponse }