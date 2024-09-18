const ImageAllowedMimeTypes = {
  jfif: 'image/jpeg',
  avif: 'image/avif',
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  apng: 'image/apng',
  png: 'image/png'
}
/**
 *
 * @param {string} nombre el nombre del archivo
 */
export const getExtension = (nombre) => {
  const typeNombre = typeof nombre
  if (typeNombre !== 'string') throw new Error('Se esperaba un string, recibido: ' + typeNombre)
  const partes = nombre.split('.')
  return partes.at(-1)
}

export const isAllowedImageExtension = (ext) => {
  const typeExt = typeof ext
  if (typeExt !== 'string') throw new Error('Se esperaba un string, recibido: ' + typeExt)
  const mimeType = ImageAllowedMimeTypes[ext]
  return mimeType !== undefined
}

export const isAllowedImageMimeType = (mime) => {
  const typeMime = typeof mime
  if (typeMime !== 'string') throw new Error('Se esperaba un string, recibido: ' + typeMime)
  return Object.values(ImageAllowedMimeTypes).includes(mime)
}

export const isAllowedImageNameExtension = (name) => {
  const typeName = typeof name
  if (typeName !== 'string') throw new Error('Se esperaba un string, recibido: ' + typeName)
  const extension = getExtension(name)
  if (!extension) return false
  return isAllowedImageExtension(extension)
}

export const getMimeTypeFromName = (name) => {
  const typeName = typeof name
  if (typeName !== 'string') throw new Error('Se esperaba un string, recibido: ' + typeName)
  const extension = getExtension(name)
  if (!extension) throw new Error('No hay mime-type para el nombre: ' + name)
  return ImageAllowedMimeTypes[extension]
}
export default ImageAllowedMimeTypes
