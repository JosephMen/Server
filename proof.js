// this.nombre = 'eduardo'
import express from 'express'
import createVentaRouter from './routes/venta.js'
import VentaController from './controllers/ventaController.js'
import ErrorHandler from './middlewares/error/errorHandler.js'
import pkg from 'body-parser'
const { json, urlencoded } = pkg
const ventaService = {
  add: function ({ data }) {
    data.id = 1
    return data
  },
  update: function () {
    return true
  },
  delete: function () {
    return true
  },
  get: function () {
    return {
      id: 1,
      nombre: 'XD'
    }
  },
  getAll: function () {
    return [{
      id: 1,
      nombre: 'XD'
    },
    {
      id: 2,
      nombre: 'XDD'
    }]
  }

}
const errorHandler = new ErrorHandler()
const app = express()
const ventaController = new VentaController({ ventaService })

app.use(urlencoded({ extended: true }))
app.use(json())
app.use('/venta', createVentaRouter({ ventaController }))
app.use('*', (req, res, next) => {
  return res.status(404).json({
    message: 'Ruta no encontrada',
    data: []
  })
})
app.use(errorHandler.handle)

app.listen(3001, () => {
  console.log('App de prueba en puerto http://localhost:3001')
})
