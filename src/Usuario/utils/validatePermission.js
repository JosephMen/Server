import PERMISOS from './permissions.js'
import { AuthorizationError } from '../../Common/errors/errorClasses.js'
import authCodes from '../../Common/errors/authCodes.js'
export default function ({ permiso }) {
  if (!permiso) return
  const array = Object.values(PERMISOS)
  if (!array.includes(permiso)) throw new AuthorizationError(`'${permiso}' no es un permiso valido`, authCodes.NOT_VALID)
}
