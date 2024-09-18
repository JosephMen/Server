import productoSchema from '../Schemas/productoSchema.js'

export const mapEntityToProducto = (entity) => {
  if (entity === null) return null
  return {
    id: entity.productoid,
    imagenUrl: entity.imagenurl,
    codigo: entity.codigo,
    nombre: entity.nombre,
    categoriaId: entity.categoriaid,
    descripcion: entity.descripcion
  }
}
export const mapBodyToProducto = (body) => {
  const producto = productoSchema.safeParse(body)
  if (producto.success === false) return null
  return producto.data
}
export const mapBodyToPartialProducto = (body) => {
  const producto = productoSchema.partial().safeParse(body)
  if (producto.success === false) return null
  return producto.data
}
