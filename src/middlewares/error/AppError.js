export default class AppError extends Error {
  constructor (error, message, codeError) {
    super(message)
    /**
     * @type {Error}
     */
    this.errorHandled = error
    this.codeError = codeError
    this.name = 'Error handler'
  }
}
