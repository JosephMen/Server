import UnexpectedError from '../../middlewares/error/errorClasses.js'
/**
 * @interface
 */
const errorMessage = 'Sin implementacion de interfaz IEntity'
export default class IEntity {
  getById = (id) => {
    throw new UnexpectedError(errorMessage)
  }

  add = (entity) => {
    throw new UnexpectedError(errorMessage)
  }

  update = (entity) => {
    throw new UnexpectedError(errorMessage)
  }

  delete = (id) => {
    throw new UnexpectedError(errorMessage)
  }

  getAll = () => {
    throw new UnexpectedError(errorMessage)
  }
}
