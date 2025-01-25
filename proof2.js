/* eslint-disable */

import express from 'express'
import UsuarioModel from './src/Usuario/Model/usuario.js'
import UsuarioService from './src/Usuario/Services/usuarioService.js'
import UsuarioController from './src/Usuario/Controller/usuarioController.js'
import createUsuariosRouter from './src/Usuario/Routes/usuarios.js'
import ImagenRelacion from './src/Imagen/Model/imagen-relacion.js'
import ImagenModel from './src/Imagen/Model/imagen.js'
import ImagenService from './src/Imagen/Services/imagenService.js'
import AuthController from './src/Authorization/Controller/authController.js'
import createAuthRouter from './src/Authorization/Routes/auth.js'

import {clientWrapper as cliente} from './src/connection.js'

import ErrorHandler from './src/Common/Middlewares/ErrorHandler.js'
import bodyParser from 'body-parser'

const {urlencoded} = bodyParser

const imagenModel = new ImagenModel({ cliente })
const usuarioModel = new UsuarioModel({ cliente })
const imagenRelacion = new ImagenRelacion({ cliente })

const imagenService = new ImagenService(imagenModel, imagenRelacion)
const usuarioService = new UsuarioService(usuarioModel, imagenService)
const usuarioController = new UsuarioController({ usuarioService })
const authenticationController = new AuthController({ usuarioService })

const errorHandler = new ErrorHandler()
const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(urlencoded({
    extended: true
}))
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  return next()
})
app.all('*', authenticationController.validate)
app.use('/auth', createAuthRouter({ authenticationController }))
app.use('/usuarios', createUsuariosRouter({usuarioController}))
app.get('/', (req, res, next) => {
    res.setHeader('Content-Type', 'text/html')
    return res.send('<h1>Testing usuarios api endPoint</h1>')
})
app.use(errorHandler.handle)
app.options('*', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.send()
})
app.all('*', (req, res) => {
    return res.status(404).json({
        message: 'No se ha encontrado ruta'
    })
})


const port = 1000
app.listen(port, () => {
  console.log(`listening in http://localhost:${port}`)
})
