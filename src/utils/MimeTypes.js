const MimeTypes = {
  jfif: 'image/jpeg',
  avif: 'image/avif',
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  apng: 'imagen/apng'
}
/**
 *
 * @param {string} nombre el nombre del archivo
 */
export const getExtension = (nombre) => {
  const partes = nombre.split('.')
  return partes.at(-1)
}

export default MimeTypes
