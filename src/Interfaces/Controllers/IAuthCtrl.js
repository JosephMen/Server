import { NotImplementedError } from '../../Common/errors/errorClasses.js'

export default class IAuthCtrl {
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static validate = (req, res, next) => {
    throw new NotImplementedError('Metodo "validate" no implementado en IAuthCtrl')
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  login = (req, res, next) => {
    throw new NotImplementedError('Metodo "login" no implementado en IAuthCtrl')
  }

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  checkPermission = (req, res, next) => {
    throw new NotImplementedError('Metodo "checkPermission" en IAuthCtrl')
  }
}
