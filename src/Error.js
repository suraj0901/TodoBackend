export class BadRequest extends Error {
    constructor(message) {
        super(message)
        this.code = 400
    }
}

export class Unauthorized extends Error {
    constructor(message = "") {
        super(message)
        this.code = 401
    }
}

export class Forbiden extends Error {
    constructor() {
        super('')
        this.code = 403
    }
}

export class ServerError extends Error {
    constructor(message) {
        super(message)
        this.code = 500
    }
}