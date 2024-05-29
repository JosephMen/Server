import { messageSuccessCreator } from '../utils/messageCreator.js'
import IController from '../interfaces/controllers/IController.js'
import AppError from '../middlewares/error/AppError.js'
import ProductoService from '../services/productoService.js'
import EtiquetaService from '../services/EtiquetaService.js'
import { BadArgumentsError } from '../middlewares/error/errorClasses.js'
import { mapBodyToPartialProducto, mapBodyToProducto } from '../utils/mapper.js'
import { validarBasicSchema, validarPartialBasicSchema } from '../schema/basicSchema.js'
import MimeTypes, { getExtension } from '../utils/mimeTypes.js'

export default class ProductoController extends IController {
  #rutas
  #entidades
  /**
     *
     * @param {{productoService: ProductoService, etiquetaService: EtiquetaService}}
     */
  constructor ({ productoService, etiquetaService }) {
    super()
    this.productoService = productoService
    this.etiquetaService = etiquetaService
    this.#rutas = ['categorias', 'marcas', 'proveedores']
    this.#entidades = {
      categorias: 'categoria',
      marcas: 'marca',
      proveedores: 'proveedor'
    }
  }

  checkImagen = (req, res, next) => {
    const imagen = req?.files?.imagen
    try {
      if (imagen) {
        if (Array.isArray(imagen)) throw new BadArgumentsError('Solo se recibe una imagen')
        imagen.mimetype = MimeTypes[getExtension(imagen.name)]
        if (!imagen.mimetype) throw new BadArgumentsError('Formato de archivo no soportado')
        return next()
      }
      return next()
    } catch (e) {
      return next(new AppError(e, 'Error al procesar tipo de imagen'))
    }
  }

  add = async (req, res, next) => {
    try {
      const imagen = req?.files?.imagen
      const productoBody = mapBodyToProducto(req.body)
      if (productoBody === null) throw new BadArgumentsError('Error en la peticion')
      const producto = await this.productoService.add(productoBody, imagen)
      const message = messageSuccessCreator({ mensaje: 'Producto Creado', data: producto })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al agregar producto'))
    }
  }

  update = async (req, res, next) => {
    try {
      const imagen = req?.files?.imagen
      const productoBody = mapBodyToPartialProducto(req.body)
      if (productoBody === null) throw new BadArgumentsError('Error en la peticion')
      productoBody.id = req.params.id
      const productoActualizado = await this.productoService.update(productoBody, imagen)
      const message = messageSuccessCreator({
        mensaje: 'Producto actualizado',
        data: productoActualizado
      })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al actualizar producto'))
    }
  }

  get = async (req, res, next) => {
    const id = req.params.id
    if (isNaN(Number.parseInt(id))) return next()
    try {
      const result = await this.productoService.get(id)
      const message = messageSuccessCreator({ data: result })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error de servidor en obtener Producto'))
    }
  }

  delete = async (req, res, next) => {
    try {
      const id = req.params.id
      if (isNaN(Number.parseInt(id))) return next()
      await this.productoService.delete(id)
      const message = messageSuccessCreator({ mensaje: 'Producto eliminado' })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al eliminar producto'))
    }
  }

  getAll = async (req, res, next) => {
    try {
      const offset = req?.query?.offset
      const param = {}
      if (offset) param.offset = offset
      const productos = await this.productoService.getAll(param)
      const message = messageSuccessCreator({ cantidad: productos.length, data: productos })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error de servidor al obtener todos los productos'))
    }
  }

  getAllEtiquetas = async (req, res, next) => {
    try {
      const result = await this.etiquetaService.getAll()
      const message = messageSuccessCreator({
        cantidad: result.length,
        data: result
      })
      res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error de servidor al obtener todas las etiquetas'))
    }
  }

  etiquetar = async (req, res, next) => {
    try {
      const productoId = req.body.productoId
      const etiquetasId = req.body.etiquetasId
      await this.etiquetaService.etiquetarProducto(etiquetasId, productoId)
      const message = messageSuccessCreator({
        mensaje: 'etiquetas agregadas'
      })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error de servidor al etiquetar producto'))
    }
  }

  agregarEtiquetas = async (req, res, next) => {
    try {
      const etiquetasNuevas = req.body.etiquetasNuevas
      if (!etiquetasNuevas) return next()
      const response = []
      for (const nombre of etiquetasNuevas) {
        try {
          response.push(await this.etiquetaService.add({ nombre }))
        } catch (e) {
          response.push({ nombre, id: null })
        }
      }
      const message = messageSuccessCreator({
        mensaje: 'Etiquetas agregadas',
        respuesta: response
      })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al agregar nuevas etiquetas'))
    }
  }

  getResto = async (req, res, next) => {
    const ruta = req.params.ruta
    console.log('llega aqui', req.params)
    if (this.#rutas.includes(ruta) === false) return next()
    const id = Number.parseInt(req.params.id)
    if (isNaN(id)) return next()
    try {
      const entidad = this.#entidades[ruta]
      const result = await this.productoService.getResto({ entidad, id })
      const message = messageSuccessCreator({
        mensaje: 'Informacion obtenida',
        data: [result]
      })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al obtener informacion de una entidad'))
    }
  }

  addResto = async (req, res, next) => {
    const ruta = req.params.ruta
    if (this.#rutas.includes(ruta) === false) return next()
    const data = validarBasicSchema(req.body)
    const entidad = this.#entidades[ruta]
    const imagen = req?.files?.imagen
    try {
      if (data === null) throw new BadArgumentsError('Problema con el argumento para la ruta ' + ruta)
      const resultado = await this.productoService.addResto({ entidad, data, imagen })
      const message = messageSuccessCreator({
        mensaje: 'Dato agregado',
        data: [resultado]
      })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al agregar nuevo elemento en ruta' + ruta))
    }
  }

  getAllResto = async (req, res, next) => {
    const ruta = req.params.ruta
    if (this.#rutas.includes(ruta) === false) return next()
    try {
      const entidad = this.#entidades[ruta]
      const resultado = await this.productoService.getAllResto(entidad)

      const message = messageSuccessCreator({
        mensaje: 'Resultado',
        cantidad: resultado.length,
        data: resultado
      })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al obtener con la ruta de ' + ruta))
    }
  }

  deleteResto = async (req, res, next) => {
    const ruta = req.params.ruta
    const id = req.params.id
    if (!id || this.#rutas.includes(ruta) === false) return next()
    if (isNaN(Number.parseInt(id))) return next()
    try {
      const result = await this.productoService.deleteResto(this.#entidades[ruta], id)
      const mensaje = result ? 'Eliminado correctamente' : 'No se ha podido eliminar'
      const message = messageSuccessCreator({
        mensaje
      })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al eliminar en la ruta ' + ruta))
    }
  }

  updateResto = async (req, res, next) => {
    const ruta = req.params.ruta
    const id = Number.parseInt(req.params.id)
    if (!id || this.#rutas.includes(ruta) === false) return next()
    if (isNaN(id)) return next()
    const imagen = req?.files?.imagen
    try {
      const data = validarPartialBasicSchema(req.body)
      if (data === null) throw new BadArgumentsError('Error en los parametros')
      const result = await this.productoService.updateResto(this.#entidades[ruta], { id, ...data }, imagen)
      let mensaje = 'informacion actualizada correctamente'
      if (result === null) mensaje = 'no se ha podido actualizar los datos'
      const message = messageSuccessCreator({
        mensaje,
        data: [result]
      })
      return res.json(message)
    } catch (e) {
      return next(new AppError(e, 'Error al actualizar en la ruta ' + ruta))
    }
  }
}
