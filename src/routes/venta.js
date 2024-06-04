import { Router } from 'express'
import VentaController from '../controllers/ventaController.js'
import { dateFormatterCustom } from '../middlewares/dateFormatter.js'

/**
 *
 * @param {{ventaController : VentaController}} param0
 */
const createVentaRouter = ({ ventaController }) => {
  const ventaRouter = Router()
  const dateFormatterMid = dateFormatterCustom('fechaRealizada')
  ventaRouter.get('/', ventaController.getAll)
  ventaRouter.get('/:id', ventaController.get)

  ventaRouter.post('/', dateFormatterMid, ventaController.validateAddBody, ventaController.add)
  ventaRouter.post('/detail', ventaController.validateVentaReq, ventaController.add)

  ventaRouter.patch('/:id', dateFormatterMid, ventaController.validateUpdateBody, ventaController.update)
  ventaRouter.patch('/detail/:id', ventaController.validateUpdateVentaReq, ventaController.update)

  ventaRouter.delete('/:id', ventaController.delete)
  return ventaRouter
}
export default createVentaRouter
