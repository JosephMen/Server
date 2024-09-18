import AppError from '../../Common/errors/AppError.js'
import { messageSuccessCreator } from '../../Common/utils/messageCreator.js'
export default class VentaController {
  #ventaService
  /**
   *
   * @param {Object} param0
   * @param {import('../Services/VentaService.js').default} param0.ventaService
   */
  constructor ({ ventaService }) {
    this.#ventaService = ventaService
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns
   */
  add = async (req, res, next) => {
    try {
      const venta = await this.#ventaService.add(req.body)
      const message = messageSuccessCreator({ mensaje: 'Venta actualizada con exito', data: venta })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al agregar detalles de venta'))
    }
  }

  update = async (req, res, next) => {
    try {
      if (req.skip) return next()
      const venta = await this.#ventaService.update(req.body)
      const message = messageSuccessCreator({ mensaje: 'Venta actualizada con exito', data: venta })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al agregar detalles de venta'))
    }
  }

  delete = async (req, res, next) => {
    try {
      const id = Number.parseInt(req.params.id)
      if (isNaN(id)) return next()
      const result = await this.#ventaService.delete(id)
      const mensaje = result ? 'Venta eliminada exitosamente' : 'No se ha podido eliminar venta'
      const message = messageSuccessCreator({ mensaje })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al eliminar venta'))
    }
  }

  get = async (req, res, next) => {
    try {
      const id = Number.parseInt(req.params.id)
      if (isNaN(id)) return next()
      const result = await this.#ventaService.get(id)
      const mensaje = result === null ? 'No se ha encontrado entidad' : 'Entidad encontrada'
      const message = messageSuccessCreator({ mensaje, data: [result] })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al buscar venta por id'))
    }
  }

  getAll = async (req, res, next) => {
    try {
      const result = await this.#ventaService.getAll()
      const message = messageSuccessCreator({ mensaje: 'Ventas encontradas', data: result })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al buscar venta por id'))
    }
  }
}
