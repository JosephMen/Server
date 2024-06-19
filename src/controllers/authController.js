import jwt from 'jsonwebtoken'
import UsuarioService from '../services/usuarioService'
import bcrypt from 'bcryptjs'
const { compare } = bcrypt
export default class AuthenticationController {
  #usuarioService
  /**
   *
   * @param {Object} param0
   * @param {UsuarioService} param0.usuarioService
   */
  constructor ({ usuarioService }) {
    this.#usuarioService = usuarioService
  }

  login = async (req, res, next) => {
    const { user } = req.body
    const userBD = await this.#usuarioService.getByName(user)
    const match = await compare(userBD.password, user.password)
    if (!match) return res.status(401).json({ ok: false, message: 'user or pass not valid' })
    const token = jwt.sign({ user, permiso: userBD.permiso }, process.env.LLAVE_SECRETA)
    res.cookie('jwt', token)
    return res.json({ ok: true })
  }

  validate = (req, res, next) => {
    try {
      const token = req?.cookies?.jwt
      if (!token) {
        req.user = { nombre: 'Invitado', permiso: 'invitado' }
        return next()
      }
      const validPayload = jwt.verify(token, process.env.LLAVE_SECRETA)
      req.user = validPayload.user
      return next()
    } catch (e) {
      return res.status(401).json({ ok: false, message: 'Token no valido' })
    }
  }
}
