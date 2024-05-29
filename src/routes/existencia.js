import { Router } from 'express'
import ExistenciaController from '../controllers/existenciaController.js'
import dateFormatter from '../middlewares/dateFormatter.js'

/**
 *
 * @param {{existenciaController : ExistenciaController}} param0
 */
const createExistenciaRouter = ({ existenciaController }) => {
  const existenciaRouter = Router()
  existenciaRouter.get('/', existenciaController.getAll)
  existenciaRouter.get('/:id', existenciaController.getById)

  existenciaRouter.post('/', dateFormatter, existenciaController.add)

  existenciaRouter.patch('/:id', dateFormatter, existenciaController.update)

  existenciaRouter.delete('/:id', existenciaController.delete)
  return existenciaRouter
}
export default createExistenciaRouter
