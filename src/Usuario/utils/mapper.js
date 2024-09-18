import usuarioSchema from '../Schemas/usuarioSchema.js'
export const mapEntityToUsuario = (entity) => {
  if (entity === null) return null
  return {
    id: entity.id,
    nombre: entity.nombre,
    imagenUrl: entity.imagenurl,
    password: entity.password ?? '',
    permiso: entity.permiso ?? ''
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

/**
 *
 * @param {import('../Model/usuario.js').Usuario} usuario
 */
export function mapEntityUsuarioToShow (usuario) {
  return {
    nombre: usuario.nombre,
    id: usuario.id,
    imagenUrl: usuario.imagenUrl,
    permiso: usuario.permiso
  }
}
