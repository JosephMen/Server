/* eslint-disable */
import { describe, beforeEach,expect, test, vi } from 'vitest'
import ProductoModel from '../models/producto'


describe.skip('Para la clase ProductoModel', () => {
    const mockQuery = vi.fn()
    mockQuery.mockResolvedValueOnce({rows:[]})
    .mockRejectedValueOnce()
    const cliente = {
        query: mockQuery
    }
    const productoModel = new ProductoModel({cliente})
    const params = {
        id:null,
        nombre: null,
        codigo: null,
        descripcion: null,
        imagenUrl: null
    }
    test('Para el metodo getAll', async () => {
        await expect(productoModel.getAll()).resolves.toEqual([])
        await expect(productoModel.getAll()).rejects.toThrow()
    })
    test("Para el metodo getById", async () => {

        const mockQuery = vi.fn()
        mockQuery.mockResolvedValueOnce({rows:[null], rowCount: 1})
        .mockRejectedValueOnce()
        const cliente = {
            query: mockQuery
        }
        productoModel.Cliente = cliente
        await expect(productoModel.getById()).rejects.toThrow()
        await expect(productoModel.getById(1)).resolves.toBe(null)
        await expect(productoModel.getById(1)).rejects.toThrow()
    })
    test("Para el metodo add", async () => {
        const mockQuery = vi.fn()
        mockQuery.mockResolvedValueOnce({rows:[{productoid: 1}]})
        .mockRejectedValueOnce()
        const cliente = {
            query: mockQuery
        }
        productoModel.Cliente = cliente
        await expect(productoModel.add()).rejects.toThrow()
        await expect(productoModel.add(params)).resolves.toBe(1)
        await expect(productoModel.add(params)).rejects.toThrow()
    })
    test("Para el metodo set", async () => {
        
        const mockQuery = vi.fn()
        mockQuery.mockResolvedValueOnce(1)
        .mockRejectedValueOnce()
        const cliente = {
            query: mockQuery
        }
        
        productoModel.Cliente = cliente
        await expect(productoModel.update()).rejects.toThrow()
        await expect(productoModel.update(params)).resolves.toBe(1)
        await expect(productoModel.update(params)).rejects.toThrow()
    })
    test("Para el metodo delete", async () => {

        const mockQuery = vi.fn()
        mockQuery.mockResolvedValueOnce(1)
        .mockRejectedValueOnce()
        const cliente = {
            query: mockQuery
        }
        productoModel.Cliente = cliente
        await expect(productoModel.delete()).rejects.toThrow()
        await expect(productoModel.delete(1)).resolves.toBe(1)
        await expect(productoModel.delete(1)).rejects.toThrow()
    })
})