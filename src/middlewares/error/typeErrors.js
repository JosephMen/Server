/**
 * @enum
 * @readonly
 */
const errorTypes = Object.freeze({
  Connection: 'Connection Error',
  BadArguments: 'Bad Arguments',
  UnexpectedError: 'Unexpected Error',
  ServerError: 'Server Error',
  RelationalDataError: 'Relational Data Error',
  SchemaObject: 'Schema Object Error'
})
export default errorTypes
