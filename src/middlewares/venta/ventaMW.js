import AppError from '../error/AppError.js'
import ventaSchema from '../../schema/ventaSchema.js'
import { BadSchemaObjectError } from '../error/errorClasses.js'
import { validateListaProductosVentaSchema, validateVentaInPartialSchema, validateVentaInSchema } from '../../schema/ventaInSchema.js'
export function validateAddBody (req, res, next) {
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

export function validateUpdateBody (req, res, next) {
  try {
    const id = Number(parseInt(req.params.id))
    const parse = ventaSchema.partial().safeParse(req.body)
    if (!parse.success) throw new BadSchemaObjectError('Error en los argumentos del body')
    const { data } = parse
    req.data = data
    req.id = id
    return next()
  } catch (e) {
    return next(new AppError(e, 'Error con los argumentos del body para actualizar venta'))
  }
}

export function validateBodyForAddVenta (req, res, next) {
  try {
    const { venta, listaProductos } = req.body
    const dataVenta = validateVentaInSchema(venta)
    const dataLista = validateListaProductosVentaSchema(listaProductos)
    delete req.body.venta
    delete req.body.listaProductos
    req.body.ventaIn = dataVenta
    req.body.productosVenta = dataLista
    return next()
  } catch (e) {
    return next(new AppError(e, 'Error con los argumentos para la creacion de venta'))
  }
}

export function validateBodyForUpdateVenta (req, res, next) {
  try {
    const { listaProductos, venta } = req.body
    const id = Number.parseInt(req.params.id)
    if (isNaN(id)) {
      req.skip = true
      return next()
    }
    delete req.body.venta
    delete req.body.listaProductos
    const dataLista = validateListaProductosVentaSchema(listaProductos)
    const dataVenta = validateVentaInPartialSchema(venta)
    dataVenta.id = id
    req.body.productosVenta = dataLista
    req.body.ventaIn = dataVenta
    return next()
  } catch (e) {
    return next(new AppError(e, 'Error con los argumentos para la actualizar venta'))
  }
}
