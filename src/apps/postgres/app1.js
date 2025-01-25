import e from 'express'
import bodyParser from 'body-parser'
import AuthenticationController from '../../Authorization/Controller/authController.js'
const { urlencoded } = bodyParser
const DEFAULT_CONFIG = {
  PORT: 1000
}
export default class AppDemo {
  /**
   * @type {Array<import('../../Interfaces/IRoute').default>}
   */
  #arrayRoutes
  /**
   * @type {import('../../Interfaces/IError/IErrorHandler').default}
   */
  #errorHandler
  #configuration

  #notFoundRoute
  #app

  constructor (configuration = DEFAULT_CONFIG) {
    this.#arrayRoutes = []
    this.#configuration = configuration
    this.#errorHandler = null
    this.#app = e()
    this.#init()
  }

  #init = () => {
    this.#app.disable('x-powered-by')
    this.#app.use(e.json())
    this.#app.use(urlencoded({
      extended: true
    }))
    this.#app.use(AuthenticationController.validate)
    this.#notFoundRoute = (req, res, next) => {
      return res.status(404).send('route not found')
    }
  }

  /**
   *
   * @param {import('../../Interfaces/IRoute').default} route
   */
  addRoute = (route) => {
    this.#arrayRoutes.push(route)
  }

  /**
   *
   * @param {CallableFunction} callback
   */
  serve = (callback) => {
    this.#arrayRoutes.forEach(route => {
      this.#app.use('/' + route.getPath(), route.get())
    })
    this.#app.use('*', this.#notFoundRoute)
    this.#errorHandler && this.#app.use(this.#errorHandler.getHandler())
    this.#app.listen(this.#configuration.PORT, () => {
      callback()
      console.log(`App serve in port: http://localhost:${this.#configuration.PORT}`)
    })
  }

  /**
   *
   * @param {import('../../Interfaces/IError/IErrorHandler').default} errorHandler
   */
  setErrorHandler = (errorHandler) => {
    this.#errorHandler = errorHandler
  }
}
