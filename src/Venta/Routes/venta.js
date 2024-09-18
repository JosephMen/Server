import { Router } from 'express'
import { validateBodyForAddVenta, validateBodyForUpdateVenta } from '../middlewares/venta/ventaMW.js'
import VentaController from '../controllers/ventaController.js'
/**
 *
 * @param {{ventaController : VentaController}} param0
 */
const createVentaRouter = ({ ventaController }) => {
  const router = Router()
  router.get('/', ventaController.getAll)
  router.get('/:id', ventaController.get)

  router.post('/', validateBodyForAddVenta, ventaController.add)

  router.patch('/:id', validateBodyForUpdateVenta, ventaController.update)

  router.delete('/:id', ventaController.delete)
  return router
}
export default createVentaRouter
