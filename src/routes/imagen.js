import { Router } from 'express'
import ImagenController from '../controllers/imagenController.js'
/**
 * @param {{imagenController: ImagenController}}
 * @returns  {Router}
 */
const createImagenRouter = ({ imagenController }) => {
  const imagenRouter = Router()
  imagenRouter.get('/:id', imagenController.getImagen)
  return imagenRouter
}
export default createImagenRouter
