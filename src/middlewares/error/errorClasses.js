import errorTypes from './typeErrors.js'
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
   */
  constructor (message) {
    super(message)
    this.name = errorTypes.BadArguments
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
