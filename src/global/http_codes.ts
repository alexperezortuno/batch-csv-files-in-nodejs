export enum HttpError {
    badRequest = 400,
    unauthorized,
    paymentRequired,
    forbidden,
    notFound,
    methodNotAllowed,
    notAcceptable,
    requestTimeout = 408,
    conflict,
    gone,
    lengthRequired,
    preconditionFailed,
    payloadTooLarge,
    requestUriTooLong,
    unsupportedMediaType,
    internalServerError = 500
}

export enum HttpSuccess {
    ok = 200,
    created,
    accepted,
    noContent= 204,
    partialContent = 206,
    multiStatus
}
