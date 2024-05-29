import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
  const { user, pass } = req.body
  if (!user || !pass) return res.json({ ok: false, message: 'user or pass not valids' })
  const token = jwt.sign({ user }, process.env.LLAVE_SECRETA)
  res.cookie('jwt', token)
  return res.json({
    user, pass, token
  })
}
export const login = (req, res, next) => {
  try {
    const token = req?.cookies?.jwt
    if (!token) {
      req.user = 'anonimo'
      return next()
    }
    const validPayload = jwt.verify(token, process.env.LLAVE_SECRETA)
    req.user = validPayload.user
    return next()
  } catch (e) {
    console.log(e)
    return res.status(401).json({ ok: false, message: 'Token no valido' })
  }
}

export default auth
