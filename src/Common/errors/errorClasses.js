import errorTypes from './typeErrors.js'
import authCodes from './authCodes.js'
export default class UnexpectedError extends Error {
  /**
   * @param {String} message mensaje del error
   */
  constructor (message) {
    super(message)
    this.name = errorTypes.UnexpectedError
  }
}
export class ConnectionError extends Error {
  /**
   * @param {Error} error
   * @param {String} message mensaje del error
   */
  constructor (error, message) {
    super(message)
    this.name = errorTypes.Connection
    this.description = error
  }
}
export class BadArgumentsError extends Error {
  /**
   * @param {String} message mensaje del error
   * @param {*} expected
   * @param {*} received
   */
  constructor (message) {
    super(message)
    this.name = errorTypes.BadArguments
  }
}

export class BadArgumentsFromClientError extends Error {
  /**
   * @param {String} message mensaje del error
   * @param {*} expected
   * @param {*} received
   */
  constructor (message, expected = null, received = null) {
    super(message)
    this.name = errorTypes.BadArguments
    this.expected = expected
    this.received = received
  }
}
export class ServerError extends Error {
  /**
   * @param {String} message mensaje del error
   */
  constructor (message) {
    super(message)
    this.name = errorTypes.ServerError
  }
}
export class RelationalDataError extends Error {
  /**
   *
   * @param {String} message mensaje del error
   */
  constructor (error, message) {
    super(message)
    this.name = errorTypes.RelationalDataError
    this.description = error
  }
}

export class BadSchemaObjectError extends Error {
  /**
   *
   * @param {string} message mensaje de error
   */
  constructor (message) {
    super(message)
    this.name = errorTypes.SchemaObject
  }
}

export class AuthorizationError extends Error {
  constructor (message, codigo) {
    super(message)
    this.name = errorTypes.AuthorizationError
    this.codigo = codigo ?? authCodes.USER_PASS_NOT_VALID
  }
}

export class BadRequestError extends Error {
  constructor (message) {
    super(message)
    this.name = errorTypes.BadRequestError
  }
}
