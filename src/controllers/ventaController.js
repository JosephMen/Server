import { BadArgumentsError } from '../middlewares/error/errorClasses.js'
import ventaSchema from '../schema/ventaSchema.js'
import VentaService from '../services/VentaService.js'
import AppError from '../middlewares/error/AppError.js'
import { messageSuccessCreator } from '../utils/messageCreator.js'
import { validateArrayProdVInSchema, validateVentaInSchema } from '../schema/ventaInSchema.js'

export default class VentaController {
  #ventaService
  /**
   *
   * @param {Object} param0
   * @param {VentaService} param0.ventaService
   */
  constructor ({ ventaService }) {
    this.#ventaService = ventaService
  }

  validateAddBody = (req, res, next) => {
    try {
      const parse = ventaSchema.safeParse(req.body)
      if (!parse.success) throw parse.error
      const { data } = parse
      req.data = data
      return next()
    } catch (e) {
      return next(new AppError(e, 'Error con los argumentos del body para agregar nueva venta'))
    }
  }

  validateUpdateBody = (req, res, next) => {
    try {
      const id = Number(parseInt(req.params.id))
      const parse = ventaSchema.partial().safeParse(req.body)
      if (!parse.success) throw new BadArgumentsError('Error en los argumentos del body')
      const { data } = parse
      req.data = data
      req.id = id
      return next()
    } catch (e) {
      return next(new AppError(e, 'Error con los argumentos del body para actualizar venta'))
    }
  }

  validateVentaReq = (req, res, next) => {
    try {
      const { venta, listaProductos } = req.body
      const dataVenta = validateVentaInSchema(venta)
      const dataLista = validateArrayProdVInSchema(listaProductos)
      req.body.venta = dataVenta
      req.body.listaProductos = dataLista
      return next()
    } catch (e) {
      return next(new AppError(e, 'Error con los argumentos para la creacion de venta'))
    }
  }

  validateUpdateVentaReq = (req, res, next) => {
    try {
      const { listaProductos } = req.body
      const id = Number.parseInt(req.params.id)
      if (isNaN(id)) throw new BadArgumentsError('Id debe ser un numero')
      const dataLista = validateArrayProdVInSchema(listaProductos)
      req.body.listaProductos = dataLista
      req.body.ventaId = id
      return next()
    } catch (e) {
      return next(new AppError(e, 'Error con los argumentos para la actualizar venta'))
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns
   */
  addVenta = async (req, res, next) => {
    try {
      const { venta: ventaIn, listaProductos: listaProductosVenta } = req.body
      const venta = await this.#ventaService.addTransact({ listaProductosVenta, ventaIn })
      const message = messageSuccessCreator({ mensaje: 'Venta actualizada con exito', data: venta })
      return res.json(message)
    } catch (e) {
      console.log(e)
      return next(new AppError(e, 'Error al agregar detalles de venta'))
    }
  }

  updateVenta = async (req, res, next) => {
    try {
      const { ventaId, listaProductos: prodVListIn } = req.body
      const venta = await this.#ventaService.updateTransact({ ventaId, prodVListIn })
      const message = messageSuccessCreator({ mensaje: 'Venta actualizada con exito', data: venta })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al agregar detalles de venta'))
    }
  }

  add = async (req, res, next) => {
    try {
      const { data } = req
      await this.#ventaService.add({ data })
      const message = messageSuccessCreator({ mensaje: 'Venta insertada exitosamente', data })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al agregar nueva venta'))
    }
  }

  update = async (req, res, next) => {
    try {
      const { data, id } = req
      if (isNaN(id)) return next()
      await this.#ventaService.update({ id, data })
      const message = messageSuccessCreator({ mensaje: 'Venta actualizada exitosamente', data })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al actualizar venta'))
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
