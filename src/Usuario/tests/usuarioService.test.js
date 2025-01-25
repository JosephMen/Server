import { vi, describe, test, expect } from 'vitest'
import UsuarioService from '../Services/usuarioService'
import { BadArgumentsError, BadRequestError } from '../../Common/errors/errorClasses'

const usuarioModel = {
  add: vi.fn(),
  update: vi.fn(),
  getById: vi.fn(),
  delete: vi.fn(),
  getClientForTransact: vi.fn(),
  getByUserName: vi.fn()
}
const imagenService = {
  attachImageToUsuario: vi.fn(),
  deleteImageFromUsuario: vi.fn()
}
const usuarioService = new UsuarioService(usuarioModel, imagenService)
describe('Para la clase "usuarioService"', () => {
  describe('Para el metodo "add"', () => {
    test('Debe ejecutarse correctamente con los parametros correctos', async () => {
      // Arreglar
      const usuario = { password: 'aventura' }
      const imagen = {}
      usuarioModel.add.mockResolvedValue(1)
      usuarioModel.getById.mockResolvedValue(usuario)
      usuarioModel.getClientForTransact.mockReturnValue({ query: vi.fn(), release: vi.fn() })
      usuarioModel.getByUserName.mockResolvedValue(null)
      imagenService.attachImageToUsuario.mockResolvedValue('imagen/user1.jpg')

      // Actuar
      const result = await usuarioService.add(usuario, imagen)

      // Asertar
      expect(result).toEqual(usuario)
    })

    test('Si no se le pasa argumento imagen el usuario no debe tener propiedad "imagenUrl"', async () => {
      // Arreglar
      const usuario = { password: 'aventura' }
      usuarioModel.add.mockResolvedValue(1)
      usuarioModel.getById.mockResolvedValue(usuario)
      imagenService.attachImageToUsuario.mockResolvedValue('imagen/user1.jpg')

      // Actuar
      const result = await usuarioService.add(usuario)

      // Asertar
      expect(result.imagenUrl).toBeTypeOf('undefined')
    })
  })
  describe('Para el metodo "update"', () => {
    test('Con los parametros correctos debe devolver el usuario mockeado', async () => {
      // Arreglar
      const usuario = { password: 'aventura', id: 1, nombre: 'frander' }
      const imagen = {}
      usuarioModel.getById.mockResolvedValue(usuario)
      imagenService.attachImageToUsuario.mockResolvedValue('imagen/user1.jpg')
      // Actuar
      const result = await usuarioService.update(usuario, imagen)
      // Asertar
      expect(result).toEqual(usuario)
    })

    test('Si no se le pasa imagen igual debe devolver el usuario mockeado', async () => {
      // Arreglar
      const usuario = { password: 'aventura', id: 1, nombre: 'frander' }
      usuarioModel.getById.mockResolvedValue(usuario)
      imagenService.attachImageToUsuario.mockResolvedValue('imagen/user1.jpg')
      // Actuar
      const result = await usuarioService.update(usuario)
      // Asertar
      expect(result).toEqual(usuario)
    })

    test('Si el usuario no existe debe arrojar un error de "BadArgumentsError"', async () => {
      // Arreglar
      const usuario = { password: 'aventura', id: 1, nombre: 'frander' }
      const imagen = {}
      usuarioModel.getById.mockResolvedValue(null)
      imagenService.attachImageToUsuario.mockResolvedValue('imagen/user1.jpg')
      // Actuar
      const func = async () => await usuarioService.update(usuario, imagen)
      // Asertar
      expect(func).rejects.toThrow(BadRequestError)
    })
  })
  describe('Para el metodo "delete"', () => {
    test('Cuando se le pasan parametros correctos', async () => {
      // Arreglar
      const id = 1
      usuarioModel.delete.mockResolvedValue(true)
      usuarioModel.getById.mockResolvedValue(1)
      imagenService.deleteImageFromUsuario.mockResolvedValue(true)
      // Actuar
      const func = async () => await usuarioService.delete(id)

      // Asertar
      expect(func()).resolves.not.Throw()
    })

    test('Cuando el modelo de conexion a base de datos no elimina, retorna false', async () => {
      // Arreglar
      const id = 1
      usuarioModel.delete.mockResolvedValue(false)

      // Actuar
      const func = async () => await usuarioService.delete(id)

      // Asertar
      expect(await func()).toBe(false)
    })

    test('Cuando el modelo de conexion a base de datos erra', async () => {
      // Arreglar
      const id = 1
      usuarioModel.delete.mockRejectedValue(new BadArgumentsError(''))

      // Actuar
      const func = async () => await usuarioService.delete(id)

      // Asertar
      expect(func()).rejects.toThrow()
    })
  })
})
