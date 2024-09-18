import { Router } from 'express'
import ProductoController from '../controllers/productoController.js'
/**
 *
 * @param {{productoController: ProductoController}} param0
 * @returns {Router}
 */
const createProductoRouter = ({ productoController }) => {
  const productoRouter = Router()

  // todos
  productoRouter.use(productoController.checkImagen)

  // post
  productoRouter.post('/', productoController.add)
  productoRouter.post('/etiquetas', productoController.agregarEtiquetas)
  productoRouter.post('/etiquetas', productoController.etiquetar)
  productoRouter.post('/:ruta', productoController.addResto)

  // get
  productoRouter.get('/', productoController.getAll)
  productoRouter.get('/:id', productoController.get)
  productoRouter.get('/etiquetas', productoController.getAllEtiquetas)
  productoRouter.get('/:ruta/:id', productoController.getResto)
  productoRouter.get('/:ruta', productoController.getAllResto)

  // patch
  productoRouter.patch('/:id', productoController.update)
  productoRouter.patch('/:ruta/:id', productoController.updateResto)

  // delete
  productoRouter.delete('/:id', productoController.delete)
  productoRouter.delete('/:ruta/:id', productoController.deleteResto)

  return productoRouter
}
export default createProductoRouter
