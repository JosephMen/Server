import { NotImplementedError } from '../Common/errors/errorClasses.js'

export default class IRoute {
  /**
   * @returns {import('express').Router}
   */
  get = () => {
    throw new Error('No implemented method')
  }

  /**
   * @returns {string}
   */
  getPath = () => {
    throw new NotImplementedError('Not implemented method "getPath" at IRoute interface')
  }
}
