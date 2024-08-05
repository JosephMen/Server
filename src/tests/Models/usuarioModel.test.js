import { describe, expect, test, vi } from 'vitest'
import UsuarioModel from '../../models/usuario'
import { BadSchemaObjectError } from '../../middlewares/error/errorClasses'

const cliente = {
  query: vi.fn()
}
const usuarioExtraido = {
  id: 1,
  nombre: 'frander',
  password: '123456',
  permiso: 'Administrador',
  imagenurl: 'img/img'
}

const usuarioFormateado = {
  id: 1,
  nombre: 'frander',
  password: '123456',
  permiso: 'Administrador',
  imagenUrl: 'img/img'
}
const usuarioCorrecto = {
  id: 1,
  nombre: 'frander',
  password: '123456',
  permiso: 'Administrador',
  imagenUrl: 'img/img'
}
const usuarioModel = new UsuarioModel({ cliente })
describe.skip('Para la clase de usuarioModel', () => {
  describe('Para el metodo "getAll"', () => {
    test('Debe devolver un array de objetos formateados', async () => {
      // Arreglar
      cliente.query.mockResolvedValue({ rows: [{ ...usuarioExtraido }] })
      // Actuar
      const result = await usuarioModel.getAll()
      // Asertar
      expect(result).toEqual([usuarioFormateado])
    })
  })
  describe('Para el metodo "getById"', () => {
    test('Debe devolver un usuario formateado', async () => {
      // Arreglar
      const devolucion = { rowCount: 1, rows: [usuarioExtraido] }
      cliente.query.mockResolvedValue(devolucion)
      // Actuar
      const result = await usuarioModel.getById(1)
      // Asertar
      expect(result).toEqual(usuarioFormateado)
    })

    test('La funcion debe arrojar un error', async () => {
      // Arreglar

      // Actuar
      const funcion = async () => await usuarioModel.getById('nani')
      // Asertar
      expect(funcion).rejects.Throw()
    })

    test('La funcion debe arrojar un error', async () => {
      // Arreglar

      // Actuar
      const funcion = async () => await usuarioModel.getById()
      // Asertar
      expect(funcion).rejects.Throw()
    })
  })

  describe('Para el metodo "getByName"', () => {
    test('Debe devolver un usuario formateado', async () => {
      // Arreglar
      const devolucion = { rowCount: 1, rows: [usuarioExtraido] }

      cliente.query.mockResolvedValue(devolucion)
      // Actuar
      const result = await usuarioModel.getByName('nani')
      // Asertar
      expect(result).toEqual(usuarioFormateado)
    })

    test('La funcion debe arrojar un error', async () => {
      // Arreglar

      // Actuar
      const funcion = async () => await usuarioModel.getByName(1)
      // Asertar
      expect(funcion).rejects.Throw()
    })

    test('La funcion debe arrojar un error', async () => {
      // Arreglar

      // Actuar
      const funcion = async () => await usuarioModel.getByName()
      // Asertar
      expect(funcion).rejects.Throw()
    })
  })

  describe('Para el metodo "delete"', () => {
    test('Debe devolver verdadero', async () => {
      // Arreglar
      cliente.query.mockResolvedValue({ rowCount: 1 })
      // Actuar
      const result = await usuarioModel.delete(1)
      // Asertar
      expect(result).toBe(true)
    })

    test('La funcion debe arrojar un error', async () => {
      // Arreglar

      // Actuar
      const funcion = async () => await usuarioModel.delete()
      // Asertar
      expect(funcion).rejects.Throw()
    })
    test('La funcion debe arrojar un error', async () => {
      // Arreglar

      // Actuar
      const funcion = async () => await usuarioModel.delete('cero')
      // Asertar
      expect(funcion).rejects.Throw()
    })
  })
  describe('Para el metodo "add"', () => {
    test('Cuando las entradas son correctas devuelve un numero', async () => {
      // Arreglar
      const resultado = { rows: [{ id: 1 }] }
      cliente.query.mockResolvedValue(resultado)
      const usuario = { ...usuarioCorrecto }

      // Actuar
      const result = await usuarioModel.add(usuario)

      // Asertar
      expect(result).toBe(1)
    })

    test('Cuando las entradas no son correctas arroja un error', async () => {
      // Arreglar
      const resultado = { rows: [{ id: 1 }] }
      cliente.query.mockResolvedValue(resultado)
      const usuario = { ...usuarioCorrecto, nombre: 1 }

      // Actuar
      const result = async () => await usuarioModel.add(usuario)

      // Asertar
      expect(result).rejects.throw()
    })
  })

  describe('Para el metodo "update"', () => {
    test('Cuando las entradas son correctas devuelve verdadero', async () => {
      // Arreglar
      const resultado = { rowCount: 1 }
      cliente.query.mockResolvedValue(resultado)
      const usuario = { ...usuarioCorrecto }

      // Actuar
      const result = await usuarioModel.update(usuario)

      // Asertar
      expect(result).toBe(true)
    })

    test('Cuando las entradas no son correctas arroja un error', async () => {
      // Arreglar
      const resultado = { rowCount: 1 }
      cliente.query.mockResolvedValue(resultado)
      const usuario = { ...usuarioCorrecto }
      delete usuario.id

      // Actuar
      const result = async () => await usuarioModel.update(usuario)

      // Asertar
      expect(result).rejects.toThrow()
    })

    test('Cuando las entradas no son correctas arroja un error', async () => {
      // Arreglar
      const resultado = { rowCount: 1 }
      cliente.query.mockResolvedValue(resultado)
      const usuario = { ...usuarioCorrecto }
      usuario.password = '134'

      // Actuar
      const result = async () => await usuarioModel.update(usuario)

      // Asertar
      expect(result).rejects.toThrow(BadSchemaObjectError)
    })
  })
})
