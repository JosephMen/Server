import AppError from '../middlewares/error/AppError.js'
import { BadArgumentsError } from '../middlewares/error/errorClasses.js'
import existencia from '../schema/existenciaSchema.js'
import ExistenciaService from '../services/existenciaService.js'
import { messageSuccessCreator } from '../utils/messageCreator.js'

export default class ExistenciaController {
  #existenciaService
  /**
   *
   * @param {object} param0
   * @param {ExistenciaService} param0.existenciaService
   */
  constructor ({ existenciaService }) {
    this.#existenciaService = existenciaService
  }

  getAll = async (req, res, next) => {
    try {
      const result = await this.#existenciaService.obtenerTodos()
      const message = messageSuccessCreator({
        mensaje: 'Registros de existencia',
        data: result
      })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al tratar de obtener registros de existencias'))
    }
  }

  getById = async (req, res, next) => {
    try {
      const id = Number.parseInt(req.params.id)
      if (isNaN(id)) return next()
      const result = await this.#existenciaService.obtener(id)
      const message = messageSuccessCreator({
        mensaje: 'Registro encontrado',
        data: [result]
      })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al traer existencia por id'))
    }
  }

  add = async (req, res, next) => {
    try {
      const validar = existencia.safeParse(req.body)
      if (!validar.success) throw new BadArgumentsError('Error con los datos para agregar existencia')
      const datos = validar.data
      await this.#existenciaService.agregar(datos)
      const message = messageSuccessCreator({
        mensaje: 'Existencia agregada',
        data: [datos]
      })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al agregar nueva existencia'))
    }
  }

  update = async (req, res, next) => {
    try {
      const id = Number.parseInt(req.params.id)
      if (isNaN(id)) return next()
      const datos = existencia.partial().safeParse(req.body)
      if (!datos.success) throw BadArgumentsError('Error con los datos para actualizar existencia')
      const data = datos.data
      const result = await this.#existenciaService.actualizar(id, data)
      const mensaje = result === null ? 'No se ha actualizado la existencia seleccionada' : 'Existencia Actualizada'
      const message = messageSuccessCreator({
        mensaje,
        data: [result]
      })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al agregar nueva existencia'))
    }
  }

  delete = async (req, res, next) => {
    try {
      const id = Number.parseInt(req.params.id)
      if (isNaN(id)) return next()
      const result = await this.#existenciaService.eliminar(id)
      const mensaje = result ? 'Eliminada existencia' : 'No se ha eliminado existencia'
      const message = messageSuccessCreator({
        mensaje
      })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al eliminar existencia'))
    }
  }
}
