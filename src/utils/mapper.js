import productoSchema from '../schema/productoSchema.js'
import usuarioSchema from '../schema/usuarioSchema.js'

export const mapEntityToUsuario = (entity) => {
  if (entity === null) return null
  return {
    id: entity.usuarioid,
    nombre: entity.nombre,
    imagenUrl: entity.imagenurl
  }
}
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
export const mapBodyToUsuario = (body) => {
  const usuario = usuarioSchema.safeParse(body)
  if (usuario.success === false) return null
  return usuario.data
}
export const mapBodyPartialToUsuario = (body) => {
  const usuario = usuarioSchema.partial().safeParse(body)
  if (usuario.success === false) return null
  return usuario.data
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
