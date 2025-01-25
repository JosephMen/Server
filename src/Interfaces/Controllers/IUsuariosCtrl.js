import { NotImplementedError } from '../../Common/errors/errorClasses.js'

/**
 * @typedef {import('express').Request} req
 * @typedef {import('express').Response} res
 * @typedef {import('express').NextFunction} next
 */

export default class IUsuariosCtrl {
  /**
   *
   * @param {req} req
   * @param {res} res
   * @param {next} next
  */
  getAll = (req, res, next) => {
    this.#throw('getAll')
  }

  /**
   *
   * @param {req} req
   * @param {res} res
   * @param {next} next
   */
  get = (req, res, next) => {
    this.#throw('get')
  }

  /**
   *
   * @param {req} req
   * @param {res} res
   * @param {next} next
   */
  add = (req, res, next) => {
    this.#throw('add')
  }

  /**
   *
   * @param {req} req
   * @param {res} res
   * @param {next} next
   */
  update = (req, res, next) => {
    this.#throw('update')
  }

  /**
   *
   * @param {req} req
   * @param {res} res
   * @param {next} next
   */
  delete = (req, res, next) => {
    this.#throw('update')
  }

  #throw (message) {
    throw new NotImplementedError(`Methodo ${message} de IUsuariosCtrl no implementado`)
  }
}
