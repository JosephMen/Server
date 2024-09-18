export function messageSuccessCreator ({ mensaje = 'Exito', descripcion = '', ...body }) {
  return {
    mensaje,
    descripcion,
    ...body
  }
}

export function messageErrorCreator ({ mensaje = 'Error', errorDes = '', ...body }) {
  return {
    mensaje,
    descripcion: errorDes,
    ...body
  }
}
