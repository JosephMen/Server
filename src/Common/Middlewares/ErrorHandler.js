import UnexpectedError, { ConnectionError, BadArgumentsError, ServerError, RelationalDataError, BadSchemaObjectError, AuthorizationError, BadRequestError, BadArgumentsFromClientError } from '../errors/errorClasses.js'
export default class ErrorHandler {
  /**
   *
   * @param {import('../errors/AppError.js').default} appError
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns
   */
  handle = (appError, req, res, next) => {
    console.log('Error detectado: ', appError.message)

    const { errorHandled } = appError
    console.log('Nombre: ', errorHandled.name)
    console.log('Mensaje: ', errorHandled.message)
    if (errorHandled instanceof BadArgumentsError) {
      return res.status(500).json({
        message: 'Error de servidor'
      })
    }
    if (errorHandled instanceof BadArgumentsFromClientError) {
      const expected = errorHandled.expected
      const received = errorHandled.received
      return res.status(400).json({
        message: 'Error con los argumentos provistos por el cliente',
        expected,
        received
      })
    }
    if (errorHandled instanceof ConnectionError) {
      console.error('Descripcion: ', errorHandled.description)
      return res.status(500).json({
        message: 'Error dentro del servidor',
        data: []
      })
    }
    if (errorHandled instanceof UnexpectedError) {
      return res.status(500).json({
        message: 'Error inesperado',
        data: []
      })
    }
    if (errorHandled instanceof ServerError) {
      return res.status(500).json({
        message: 'Error de servidor',
        data: []
      })
    }
    if (errorHandled instanceof RelationalDataError) {
      console.log('Descripcion: ', errorHandled.description)
      return res.status(500).json({
        message: 'Error con los datos a agregar'
      })
    }
    if (errorHandled instanceof AuthorizationError) {
      const { userAuth } = req.body
      const { permiso, nombre, id } = userAuth
      return res.status(errorHandled.codigo).json({
        message: errorHandled.message,
        permiso,
        nombre,
        id
      })
    }
    if (errorHandled instanceof BadSchemaObjectError) {
      return res.status(400).json({
        message: 'Error con los argumentos dados'
      })
    }
    if (errorHandled instanceof BadRequestError) {
      return res.status(400).json({
        message: errorHandled.message
      })
    } else {
      console.log('error encontrado:', errorHandled.errors)
      return res.status(500).json({
        message: 'Error',
        data: []
      })
    }
  }
}
