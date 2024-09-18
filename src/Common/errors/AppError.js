import codeErrors from './codeErrors.js'
export default class AppError extends Error {
  constructor (error, message, codeError = 0) {
    super(message)
    /**
     * @type {Error}
     */
    this.errorHandled = error
    this.codeError = codeError ?? codeErrors.FATAL
    this.name = 'Error handler'
  }
}
