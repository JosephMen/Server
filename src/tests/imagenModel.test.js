/* eslint-disable */
import { describe, beforeEach,expect, test, vi } from 'vitest'
import ImagenModel from '../models/imagen'
describe.skip("Para la clase ImagenModel", () => {
  const mockQuery = vi.fn()
  const cliente = {
    query: mockQuery
  }
  const imagenModel = new ImagenModel({cliente})

  beforeEach(() => {
    imagenModel.Cliente = cliente
    cliente.query
    .mockResolvedValueOnce({rowCount: 1, rows: [1]})
    .mockResolvedValueOnce({rowCount: 0})
    .mockRejectedValueOnce()
  })
  test("Para el metodo getByUserId", async () => {
    await expect(imagenModel.getByUserId(1)).resolves.toBe(1)
    await expect(imagenModel.getByUserId(1)).resolves.toBe(null)
    await expect(imagenModel.getByUserId(1)).rejects.toThrow()
  })

  test("Para el metodo getById", async () => {
    await expect(imagenModel.getById(1)).resolves.toBe(1)
    await expect(imagenModel.getById(1)).resolves.toBe(null)
    await expect(imagenModel.getById(1)).rejects.toThrow()
  })

  test("Para el metodo add", async () => {
    const mockQ = vi.fn()
    mockQ.mockResolvedValueOnce({rows: [{imagenid: 1}]})
    .mockRejectedValueOnce()
    const cliente = {
      query : mockQ
    }
    const params = 
    { 
      imagenData: null, 
      usuarioId : null, 
      productoId : null, 
      nombre : null, 
      mimeType: null 
    }   
    imagenModel.Cliente = cliente
    await expect(imagenModel.add()).rejects.toThrow()
    await expect(imagenModel.add(params)).resolves.toBe(1)
    await expect(imagenModel.add(params)).rejects.toThrow()
  })
  test('Para el metodo update', async () => {
    const mockQ = vi.fn()
    mockQ.mockResolvedValueOnce(1)
    .mockRejectedValueOnce()
    const cliente = {
      query : mockQ
    }
    const params = 
    { 
      imagenData: null, 
      usuarioId : null, 
      productoId : null, 
      nombre : null, 
      mimeType: null 
    } 
    imagenModel.Cliente = cliente
    await expect(imagenModel.updateByProducto()).rejects.toThrow()
    await expect(imagenModel.updateByProducto(params)).resolves.toBe(1)
    await expect(imagenModel.updateByProducto(params)).rejects.toThrow()
  })

  test("Para el metodo setByUserId",async () => {
    const mockQ = vi.fn()
    mockQ.mockResolvedValueOnce(1)
    .mockRejectedValueOnce()
    const cliente = {
      query : mockQ
    }
    const params = 
    { 
      imagenData: null, 
      usuarioId : null, 
      productoId : null, 
      nombre : null, 
      mimeType: null 
    } 
    imagenModel.Cliente = cliente
    await expect(imagenModel.setByUsuario()).rejects.toThrow()
    await expect(imagenModel.setByUsuario(params)).resolves.toBe(1)
    await expect(imagenModel.setByUsuario(params)).rejects.toThrow()
  })
  test("Para el metodo countImagesByProducto",async () => {
    const mockQ = vi.fn()
    mockQ.mockResolvedValueOnce({rows:[{count:1}]})
    .mockRejectedValueOnce()
    const cliente = {
      query : mockQ
    }

    imagenModel.Cliente = cliente
    await expect(imagenModel.countImagesByProducto(1)).resolves.toBe(1)
    await expect(imagenModel.countImagesByProducto(1)).rejects.toThrow()
  })
  test("Para el metodo countImagesByUsuario",async () => {
    const mockQ = vi.fn()
    mockQ.mockResolvedValueOnce({rows:[{count:1}]})
    .mockRejectedValueOnce()
    const cliente = {
      query : mockQ
    }

    imagenModel.Cliente = cliente
    await expect(imagenModel.countImagesByUsuario(1)).resolves.toBe(1)
    await expect(imagenModel.countImagesByUsuario(1)).rejects.toThrow()
  })
  test("Para el metodo getIdByUsuario",async () => {
    const mockQ = vi.fn()
    mockQ.mockResolvedValueOnce({rows:[{imagenid:1}], rowCount: 1})
    mockQ.mockResolvedValueOnce({rowCount: 0})
    .mockRejectedValueOnce()
    const cliente = {
      query : mockQ
    }

    imagenModel.Cliente = cliente
    await expect(imagenModel.getIdByUsuario(1)).resolves.toBe(1)
    await expect(imagenModel.getIdByUsuario(1)).resolves.toBe(-1)
    await expect(imagenModel.getIdByUsuario(1)).rejects.toThrow()
  })

  test("Para el metodo getIdByProducto",async () => {
    const mockQ = vi.fn()
    mockQ.mockResolvedValueOnce({rows:[{imagenid:1}], rowCount: 1})
    mockQ.mockResolvedValueOnce({rowCount: 0})
    .mockRejectedValueOnce()
    const cliente = {
      query : mockQ
    }

    imagenModel.Cliente = cliente
    await expect(imagenModel.getIdByProducto(1)).resolves.toBe(1)
    await expect(imagenModel.getIdByProducto(1)).resolves.toBe(-1)
    await expect(imagenModel.getIdByProducto(1)).rejects.toThrow()
  })
})