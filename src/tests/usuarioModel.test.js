/* eslint-disable */
import { describe, beforeEach,expect, test, vi } from 'vitest'
import UsuarioModel from '../models/usuario'
describe.skip('Metodos del modelo de Usuario', () => {
  const Cliente = {
    query: vi.fn()
  }
  const usuarioModel = new UsuarioModel({ cliente: Cliente })
  beforeEach(() => {
    Cliente.query.mockResolvedValueOnce({ rows: [], rowCount: 0 })
    .mockRejectedValueOnce()
    .mockResolvedValueOnce({rows:[{id: 1}], rowCount: 1})
  })
  test('Metodo getAll de UsuarioModel', async () => {
    const query = vi.fn().mockResolvedValueOnce({ rows: [], rowCount: 0 })
    .mockRejectedValueOnce()
    .mockResolvedValueOnce({rows:[{usuarioid: 1,imagenurl:'1', nombre: 'nombre'}], rowCount: 1})
    Cliente.query = query
    await expect(usuarioModel.getAll()).resolves.toEqual([])
    await expect(usuarioModel.getAll()).rejects.toThrow()
    await expect(usuarioModel.getAll()).resolves.toEqual([{id: 1, imagenUrl: '1', nombre: 'nombre'}])
  })

  test('Metodo getById de UsuarioModel', async () => {
    const query = vi.fn().mockResolvedValueOnce({ rows: [], rowCount: 0 })
    .mockRejectedValueOnce()
    .mockResolvedValueOnce({rows:[{usuarioid: 1,imagenurl:'1', nombre: 'nombre'}], rowCount: 1})
    Cliente.query = query
    await expect(usuarioModel.getById(1)).resolves.toBe(null)
    await expect(usuarioModel.getById()).rejects.toThrow()
    await expect(usuarioModel.getById()).resolves.toEqual({id:1, nombre: 'nombre', imagenUrl: '1'})
  })
  test('Metodo add de UsuarioModel', async () => {
    const mockQuery  = vi.fn().mockResolvedValueOnce({rows: [{usuarioid: 1}]})
    .mockRejectedValueOnce()
    usuarioModel.Cliente = {
        query : mockQuery
    }
    await expect(usuarioModel.add({nombre: ""})).resolves.toBe(1)
    await expect(usuarioModel.add({nombre: ""})).rejects.toThrow()
  })
  test('Metodo delete de UsuarioModel', async () => {
    const mockQuery  = vi.fn()
    .mockResolvedValueOnce({rowCount: 1})
    .mockResolvedValueOnce()
    .mockRejectedValueOnce()
    usuarioModel.Cliente = {
        query : mockQuery
    }
    await expect(usuarioModel.delete(1)).resolves.toBe(true)
    await expect(usuarioModel.delete(1)).rejects.toThrow()
  })

  test('Metodo update de UsuarioModel', async () => {
    const mockQuery  = vi.fn()
    .mockResolvedValueOnce({rowCount: 1})
    .mockResolvedValueOnce({rowCount: 1})
    .mockRejectedValueOnce()
    usuarioModel.Cliente = {
        query : mockQuery
    }
    await expect(usuarioModel.delete(1)).resolves.toBe(true)
    await expect(usuarioModel.delete(1)).rejects.toThrow()
  })
})
