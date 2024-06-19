import AppError from './AppError.js'
import UnexpectedError, { ConnectionError, BadArgumentsError, ServerError, RelationalDataError, BadSchemaObjectError } from './errorClasses.js'
export default class ErrorHandler {
  /**
   *
   * @param {AppError} appError next
   * @returns
   */
  handle = (appError, req, res, next) => {
    console.log('Error detectado: ', appError.message)

    const { errorHandled } = appError
    console.log('Nombre: ', errorHandled.name)
    console.log('Mensaje: ', errorHandled.message)
    if (errorHandled instanceof BadArgumentsError) {
      return res.status(400).json({
        message: 'Problema con los argumentos',
        data: { 'argumentos-encontrados': { body: req.body, archivos: req.files, parametros: req.params } }
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
        message: 'Error al relacionar datos'
      })
    }
    if (errorHandled instanceof BadSchemaObjectError) {
      return res.status(400).json({
        message: 'Error con los argumentos dados'
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
