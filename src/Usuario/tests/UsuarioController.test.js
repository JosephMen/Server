import { vi, describe, test, expect } from 'vitest'
import UsuarioController from '../Controller/usuarioController'
const usuarioService = {
  add: vi.fn(),
  getById: vi.fn(),
  update: vi.fn(),
  getAll: vi.fn(),
  delete: vi.fn(),
  countAll: vi.fn()
}
const next = vi.fn()
const jsonResult = 2
const nextResult = 1
const resMock = {
  json () { return jsonResult }
}
const reqMock = {
  body: {}
}
const usuarioController = new UsuarioController({ usuarioService })
describe.skip('Para UsuarioController', () => {
  describe('Para el metodo "getAll"', () => {
    test('Para una llamada normal sin query params debe ejecutarse correctamente', async () => {
      // Arreglar
      const res = { ...resMock }
      const req = { ...reqMock }
      usuarioService.getAll.mockResolvedValue([])
      usuarioService.countAll.mockResolvedValue(1)
      next.mockReturnValue(nextResult)
      // Actuar
      const result = await usuarioController.getAll(req, res, next)

      // Asertar
      expect(result).toBe(jsonResult)
    })

    test('Para una llamada normal con query params debe ejecutarse correctamente', async () => {
      // Arreglar
      const res = { ...resMock }
      const req = { ...reqMock, query: { page: 1 } }

      // Actuar
      const result = await usuarioController.getAll(req, res, next)

      // Asertar
      expect(usuarioService.getAll.mock.lastCall[0]).toEqual({ page: 1 })
      expect(result).toBe(jsonResult)
    })

    test('Si el servicio que conecta a la base de datos falla este se devuelve en la funcion next', async () => {
      // Arreglar
      const res = { ...resMock }
      const req = { ...reqMock, query: { offset: 1 } }
      usuarioService.getAll.mockRejectedValue()
      // Actuar
      const result = await usuarioController.getAll(req, res, next)

      // Asertar
      expect(result).toBe(nextResult)
    })
  })
  describe('Para la funcion "get"', () => {
    test('Cuando los parametros son pasados correctamente debe volver sin errores', async () => {
      // Arreglar
      const req = { ...reqMock, body: { id: 1 } }
      const res = { ...resMock }
      usuarioService.getById.mockResolvedValue({})

      // Actuar
      const result = await usuarioController.get(req, res, next)

      // Asertar
      expect(result).toBe(jsonResult)
    })

    test('Cuando el usuario no existe debe devolver un error a la funcion next', async () => {
      // Arreglar
      const req = { ...reqMock, body: { id: 1 } }
      const res = { ...resMock }
      usuarioService.getById.mockResolvedValue(null)

      // Actuar
      const result = await usuarioController.get(req, res, next)

      // Asertar
      expect(result).toBe(nextResult)
    })

    test('Si la skip flag esta encendida debe llamar a la funcion next', async () => {
      // Arreglar
      const req = { ...reqMock, body: { skip: true } }
      const res = { ...resMock }
      usuarioService.getById.mockResolvedValue(null)

      // Actuar
      const result = await usuarioController.get(req, res, next)

      // Asertar
      expect(result).toBe(nextResult)
      expect(next.mock.lastCall).toHaveLength(0)
    })

    test('Si el servicio que conecta a la base de datos falla este se devuelve en la funcion next', async () => {
      // Arreglar
      const req = { ...reqMock, body: { skip: false } }
      const res = { ...resMock }
      usuarioService.getById.mockRejectedValue(null)

      // Actuar
      const result = await usuarioController.get(req, res, next)

      // Asertar
      expect(result).toBe(nextResult)
      expect(next.mock.lastCall).toHaveLength(1)
    })
  })
  describe('Para la funcion "add"', () => {
    test('Debe devolver todo correctamente con los parametros correctos', async () => {
      // Arreglar
      const userAuth = { id: 1, permiso: 'invitado' }
      const user = {}
      const req = { ...reqMock, body: { user, userAuth } }
      const res = { ...resMock }
      usuarioService.add.mockResolvedValue(null)

      // Actuar
      const result = await usuarioController.add(req, res, next)

      // Asertar
      expect(result).toBe(nextResult)
    })

    test('Si el servicio que guarda el registro falla debe devolver el fallo en la funcion next', async () => {
      // Arreglar
      const user = {}
      const req = { ...reqMock, body: { user } }
      const res = { ...resMock }
      usuarioService.add.mockRejectedValue(null)

      // Actuar
      const result = await usuarioController.add(req, res, next)

      // Asertar
      expect(result).toBe(nextResult)
    })
  })
  describe('Para el metodo "delete"', () => {
    test('Debe volver correctamente con la respuesta con los parametros correctos', async () => {
      // Arreglar
      const userAuth = { permiso: 'dependiente', id: 1 }
      const req = { ...reqMock, body: { id: 1, skip: false, userAuth } }
      const res = { ...resMock }
      usuarioService.delete.mockResolvedValue(true)
      usuarioService.getById.mockRejectedValue({ permiso: 'dependiente' })
      // Actuar
      const result = await usuarioController.delete(req, res, next)

      // Asertar
      expect(result).toBe(jsonResult)
    })

    test('Si el skip flag esta encendido este se devuelve en la funcion next', async () => {
      // Arreglar
      const req = { ...reqMock, body: { skip: true } }
      const res = { ...resMock }
      usuarioService.delete.mockRejectedValue()
      // Actuar
      const result = await usuarioController.delete(req, res, next)

      // Asertar
      expect(result).toBe(nextResult)
    })

    test('Si el servicio que conecta a base de datos falla este se devuelve en la funcion next', async () => {
      // Arreglar
      const req = { ...reqMock, body: { id: 1, skip: false } }
      const res = { ...resMock }
      usuarioService.delete.mockRejectedValue()
      // Actuar
      const result = await usuarioController.delete(req, res, next)

      // Asertar
      expect(result).toBe(nextResult)
    })
  })
  describe('Para la funcion "update"', () => {
    test('Con los parametros correctos debe ejecutarse correctamente', async () => {
      // Arreglar
      const userAuth = { permiso: 'dependiente', id: 1 }
      const req = { ...reqMock, body: { user: { id: 1 }, skip: false, userAuth } }
      const res = { ...resMock }
      usuarioService.update.mockReturnValue({})

      // Actuar
      const result = await usuarioController.update(req, res, next)

      // Asertar
      expect(result).toBe(jsonResult)
    })
    test('Con la skip flag encendida debe devolverse en la funcion next', async () => {
      // Arreglar
      const req = { ...reqMock, body: { skip: true } }
      const res = { ...resMock }
      // Actuar
      const result = await usuarioController.update(req, res, next)

      // Asertar
      expect(result).toBe(nextResult)
    })

    test('Si el servicio que conecta con base de datos falla debe volver en la funcion next', async () => {
      // Arreglar
      const req = { ...reqMock, body: { skip: true } }
      const res = { ...resMock }
      usuarioService.update.mockRejectedValue()

      // Actuar
      const result = await usuarioController.update(req, res, next)

      // Asertar
      expect(result).toBe(nextResult)
    })
  })
})
