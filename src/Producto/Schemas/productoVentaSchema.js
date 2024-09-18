import z from 'zod'
import { BadArgumentsError } from '../../Common/errors/errorClasses.js'
import zodErrorBuilder from '../../Common/utils/zodErrorBuilder.js'
const productoVentaSchema = z.object({
  existenciaId: z.number().min(1),
  ventaId: z.number().min(1),
  cantidad: z.number().min(0).default(1),
  precioTotal: z.number().min(0).default(0),
  precioUnitario: z.number().min(0).default(0),
  costoUnitario: z.number().min(0).default(0),
  costoTotal: z.number().min(0).default(0),
  gananciaTotal: z.number().min(0).default(0)
})
export const listaProductosVentaSchema = productoVentaSchema.array().default([])

export const validarProductoVenta = (data) => {
  const parse = productoVentaSchema.safeParse(data)
  if (!parse.success) {
    const error = zodErrorBuilder(parse.error)
    throw new BadArgumentsError('Error en los datos para schema de ProductoVenta: \n' + error)
  }
  return parse.data
}

export const validarParcialProductoVenta = (data) => {
  const parse = productoVentaSchema.partial().safeParse(data)
  if (!parse.success) {
    const error = zodErrorBuilder(parse.error)
    throw new BadArgumentsError('Error en los datos parciales para schema de ProductoVenta: ' + error)
  }
  return parse.data
}
export const productoVentaSchemaUtil = {
  cantidad: 0,
  costoUnitario: 0,
  precioUnitario: 0,
  costoTotal: 0,
  gananciaTotal: 0,
  precioTotal: 0,
  autoCalculo: function () {
    this.precioTotal = this.precioUnitario * this.cantidad
    this.costoTotal = this.costoUnitario * this.cantidad
    this.gananciaTotal = this.precioTotal - this.costoTotal
  }
}

export default productoVentaSchema
