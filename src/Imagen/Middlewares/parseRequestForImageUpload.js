import fileUpload from 'express-fileupload'
const maxSizeImage = 2 * 1024 * 1024
export default fileUpload({
  createParentPath: true,
  safeFileNames: true,
  preserveExtension: true,
  limits: { fileSize: maxSizeImage },
  abortOnLimit: true,
  limitHandler: (req, res, next) => {
    res.status(400).json({ message: 'Archivo muy grande, maximo: ' + maxSizeImage })
  }
})
