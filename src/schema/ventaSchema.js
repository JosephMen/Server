import z from 'zod'
import dateFormat from '../utils/dateFormat.js'
import { BadArgumentsError, SchemaObjectError } from '../middlewares/error/errorClasses.js'
import zodErrorBuilder from '../utils/zodErrorBuilder.js'
const format = (valor) => {
  try {
    return dateFormat(valor)
  } catch (e) {
    return undefined
  }
}
const today = new Date().toLocaleDateString('es-MX')
const ventaSchema = z.object({
  id: z.number().describe().optional(),
  fechaRealizada: z.preprocess(val => format(val), z.string({ required_error: 'Debe ser una fecha con formato dd/mm/yyyy o yyyy/mm/dd' })).default(today),
  descripcion: z.string().max(50, { message: 'Maximo 50 caracteres' }).optional(),
  clienteId: z.number().min(0, { message: 'Indice no valido' }).optional(),
  total: z.number().default(0),
  ganancia: z.number().default(0),
  esCredito: z.boolean().default(false),
  dependienteId: z.number().optional(),
  costo: z.number().min(0).default(0)
})
export const ventaSchemaArray = ventaSchema.array().default([])

export const validarVentaSchema = (datos) => {
  const parse = ventaSchema.safeParse(datos)
  if (!parse.success) {
    const error = zodErrorBuilder(parse.error)
    throw new BadArgumentsError('Error en los datos para schema de venta: ' + error)
  }
  return parse.data
}

export const validarPartialVentaSchema = (datos) => {
  const parse = ventaSchema.partial().safeParse(datos)
  if (!parse.success) {
    const error = zodErrorBuilder(parse.error)
    throw new BadArgumentsError('Error en los datos parciales para schema de venta: ' + error)
  }
  return parse.data
}

export const ventaSchemaUtil = {
  id: 0,
  fechaRealizada: '2024-1-1',
  descripcion: '',
  clienteId: null,
  total: 0,
  ganancia: 0,
  esCredito: false,
  dependienteId: null,
  costo: 0,
  /**
   *
   * @param {Object} param
   * @param {Number} param.costoTotal
   * @param {Number} param.ganaciaTotal
   * @param {Number} param.precioTotal
   */
  addProductoVenta ({ costoTotal, precioTotal, gananciaTotal }) {
    if (!costoTotal || !precioTotal || !gananciaTotal) throw new SchemaObjectError('Argumentos necesarios para realizar calculo')
    this.costo += costoTotal
    this.total += precioTotal
    this.ganancia += gananciaTotal
  },
  /**
   *
   * @param {Object} param
   * @param {Number} param.costoTotal
   * @param {Number} param.ganaciaTotal
   * @param {Number} param.precioTotal
   */
  removeProdVenta ({ costoTotal, precioTotal, gananciaTotal }) {
    if (!costoTotal || !precioTotal || !gananciaTotal) throw new SchemaObjectError('Argumentos necesarios para realizar calculo')
    this.costo -= costoTotal
    this.ganancia -= gananciaTotal
    this.total -= precioTotal
  }
}
export default ventaSchema
