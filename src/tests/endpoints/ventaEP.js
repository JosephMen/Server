import e from 'express'
import bp from 'body-parser'
import ErrorHandler from '../../middlewares/error/ErrorHandler.js'
import VentaController from '../../controllers/ventaController.js'
import createVentaRouter from '../../routes/venta.js'
const { urlencoded, json } = bp
const ventaService = {
  getAll: () => {
    return [{ nombre: 'venta' }, { nombre: 'venta2' }]
  },
  get: () => { return { nombre: 'venta' } },
  delete: () => true
}

const ventaController = new VentaController({ ventaService })
const app = e()
const errorHandler = new ErrorHandler()
app.use(urlencoded({
  extended: true
}))
app.use(json())
app.use(errorHandler.handle)
app.use('/venta', createVentaRouter({ ventaController }))
app.use('*', (req, res) => {
  return res.status(404).send('Ruta no encontrada')
})

const puerto = 3001
app.listen(puerto, () => {
  console.log('Escuchando app ' + `http://localhost:${puerto}`)
})
