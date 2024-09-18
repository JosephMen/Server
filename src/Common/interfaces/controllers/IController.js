import UnexpectedError from '../../errors/errorClasses.js'
const errorMessage = 'Sin implementacion de interfaz IUsuarioController'
/**
 * @interface
 */
export default class IController {
  get = (res, req, next) => {
    throw new UnexpectedError(errorMessage)
  }

  getAll = (res, req, next) => {
    throw new UnexpectedError(errorMessage)
  }

  update = (res, req, next) => {
    throw new UnexpectedError(errorMessage)
  }

  delete = (res, req, next) => {
    throw new UnexpectedError(errorMessage)
  }

  add = (res, req, next) => {
    throw new UnexpectedError(errorMessage)
  }
}
