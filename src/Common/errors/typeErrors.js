/**
 * @enum
 * @readonly
 */
const errorTypes = Object.freeze({
  Connection: 'Connection Error',
  BadArguments: 'Bad Arguments',
  BadArgumentsFromClient: 'Bad Arguments From Client',
  UnexpectedError: 'Unexpected Error',
  ServerError: 'Server Error',
  RelationalDataError: 'Relational Data Error',
  SchemaObject: 'Schema Object Error',
  AuthorizationError: 'Authorization Error',
  BadRequestError: 'Bad Request Error'
})
export default errorTypes
