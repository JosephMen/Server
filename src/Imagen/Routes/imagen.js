import { Router } from 'express'
/**
 * @param {{imagenController: import('../Controller/imagenController.js').default}}
 * @returns  {Router}
 */
const createImagenRouter = ({ imagenController }) => {
  const imagenRouter = Router()
  imagenRouter.get('/:id', imagenController.getImagen)
  return imagenRouter
}
export default createImagenRouter
