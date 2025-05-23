import { vi, describe, test, expect } from 'vitest'
import MwValidateBodyForAuthUsuario, { MwValidateBodyForAddUsuario, MwValidateBodyForUpdateUsuario } from '../Middlewares/usuarioMW'
import { BadSchemaObjectError } from '../../Common/errors/errorClasses'

const resMock = {
  send: vi.fn()
}
const reqMock = {
  body: {}
}
const next = vi.fn()
describe.skip('Para las validaciones en el middleware de usuarioMW.js', () => {
  describe('Para "MwValidateBodyForAuthUsuario"', () => {
    test('Debe devolver en el body del req los mismos datos que se envian', async () => {
      // Arreglar
      const username = 'frander'
      const password = 'abcedeof'
      const req = { ...reqMock, body: { username, password } }
      const res = { ...resMock }
      next.mockReturnValue(1)

      // Actuar
      await MwValidateBodyForAuthUsuario(req, res, next)
      // Asertar
      expect(req.body.user.username).toBe(username)
      expect(req.body.user.password).toBe(password)
    })

    test('Debe devolver un error en next pues el argumento "nombre" no existe en el body', async () => {
      // Arreglar
      const password = 'abcedeof'
      const req = { ...reqMock, body: { password } }
      const res = { ...resMock }

      // Actuar
      await MwValidateBodyForAuthUsuario(req, res, next)
      // Asertar
      expect(next.mock.lastCall).toHaveLength(1)
      expect(next.mock.lastCall[0].errorHandled).toBeInstanceOf(BadSchemaObjectError)
    })

    test('Debe devolver un error en next pues el argumento "nombre" no cumple con lo minimo en longitud', async () => {
      // Arreglar
      const nombre = ''
      const password = 'abcedeof'
      const req = { ...reqMock, body: { nombre, password } }
      const res = { ...resMock }

      // Actuar
      await MwValidateBodyForAuthUsuario(req, res, next)
      // Asertar
      expect(next.mock.lastCall).toHaveLength(1)
      expect(next.mock.lastCall[0].errorHandled).toBeInstanceOf(BadSchemaObjectError)
    })

    test('Debe devolver un error en next pues el argumento "nombre" no es una cadena', async () => {
      // Arreglar
      const nombre = 1
      const password = 'abcedeof'
      const req = { ...reqMock, body: { nombre, password } }
      const res = { ...resMock }

      // Actuar
      await MwValidateBodyForAuthUsuario(req, res, next)
      // Asertar
      expect(next.mock.lastCall).toHaveLength(1)
      expect(next.mock.lastCall[0].errorHandled).toBeInstanceOf(BadSchemaObjectError)
    })

    test('Debe devolver un error en next pues el argumento "password" no es valido', async () => {
      // Arreglar
      const nombre = 'frander'
      const password = 'abc'
      const req = { ...reqMock, body: { nombre, password } }
      const res = { ...resMock }

      // Actuar
      await MwValidateBodyForAuthUsuario(req, res, next)
      // Asertar
      expect(next.mock.lastCall).toHaveLength(1)
      expect(next.mock.lastCall[0].errorHandled).toBeInstanceOf(BadSchemaObjectError)
    })
  })

  describe('Para "validateBodyForAddUsuario"', () => {
    test('Debe devolver los mismos valores que se le pasan desde el body', async () => {
      // Arreglar
      const nombre = 'frander'
      const password = 'abcedafd'
      const permiso = 'administrador'
      const username = 'frander'
      const req = { ...reqMock, body: { nombre, password, permiso, username } }
      const res = { ...resMock }

      // Actuar
      await MwValidateBodyForAddUsuario(req, res, next)

      // Asertar
      expect(req.body.user.nombre).toBe(nombre)
      expect(req.body.user.password).toBe(password)
      expect(req.body.user.permiso).toBe(permiso)
      expect(req.body.user.username).toBe(username)
    })

    test('Debe devolver un error a la funcion next pues "password" no cumple con los requisitos', async () => {
      // Arreglar
      const nombre = 'frander'
      const password = 'abc'
      const permiso = 'admin'
      const req = { ...reqMock, body: { nombre, password, permiso } }
      const res = { ...resMock }

      // Actuar
      await MwValidateBodyForAddUsuario(req, res, next)

      // Asertar
      expect(next.mock.lastCall).toHaveLength(1)
      expect(next.mock.lastCall[0].errorHandled).toBeInstanceOf(BadSchemaObjectError)
    })

    test('Debe devolver un error a la funcion next pues "permiso" no es suministrado', async () => {
      // Arreglar
      const nombre = 'frander'
      const password = 'abc'
      const req = { ...reqMock, body: { nombre, password } }
      const res = { ...resMock }

      // Actuar
      await MwValidateBodyForAddUsuario(req, res, next)

      // Asertar
      expect(next.mock.lastCall).toHaveLength(1)
      expect(next.mock.lastCall[0].errorHandled).toBeInstanceOf(BadSchemaObjectError)
    })
  })
  describe('Para "validateBodyForUpdateUsuario"', () => {
    test('Debe devolver los mismos argumentos que se le pasan por el body', async () => {
      // Arreglar
      const id = 1
      const nombre = 'frander'
      const password = 'abcedafd'
      const permiso = 'administrador'
      const username = 'username'
      const req = { ...reqMock, body: { id, nombre, username, password, permiso } }
      const res = { ...resMock }

      // Actuar
      await MwValidateBodyForUpdateUsuario(req, res, next)

      // Asertar
      expect(req.body.user).toEqual({ nombre, permiso, id, username })
    })

    test('Debe devolver un error en next pues "nombre" no cumple con las reglas ', async () => {
      // Arreglar
      const nombre = 'fra'
      const password = 'abcedafd'
      const permiso = 'administrador'
      const req = { ...reqMock, body: { nombre, password, permiso } }
      const res = { ...resMock }

      // Actuar
      await MwValidateBodyForUpdateUsuario(req, res, next)

      // Asertar
      expect(next.mock.lastCall).toHaveLength(1)
      expect(next.mock.lastCall[0].errorHandled).toBeInstanceOf(BadSchemaObjectError)
    })

    test('Debe devolver un 1 pues "skip" es ajustado a true', async () => {
      // Arreglar
      const skip = true
      const req = { ...reqMock, body: { skip } }
      const res = { ...resMock }
      next.mockReturnValue(1)

      // Actuar
      const result = await MwValidateBodyForUpdateUsuario(req, res, next)

      // Asertar
      expect(result).toBe(1)
    })
  })
})
