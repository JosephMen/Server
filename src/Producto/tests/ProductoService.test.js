/* eslint-disable */
import {vi, describe, test, expect, beforeEach} from 'vitest'
import ProductoService from '../Services/productoService'
import { ConnectionError } from '../../Common/errors/errorClasses'

const productoModel = {
    getAll: vi.fn(),
    getById: vi.fn(),
    add: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
}
const imagenService = {
    attachImageToProducto: vi.fn(),
    attachImageToUsuario: vi.fn()
}
const schemaProducto = {
    id: 1,
    imagenUrl: 'imagen/2',
    nombre: 'nombre',
    descripcion: 'descripcion',
    categoriaId: 'categoria',
    codigo: 'codigo'
}
const productoService = new ProductoService({imagenService, productoModel})

describe.skip('Test para productoService', () => {
    describe("Para el metodo getAll", () => {
        test("Con funcionamiento correcto debe devolver un array vacio", async () => {
            productoModel.getAll.mockResolvedValueOnce([])
            await expect(productoService.getAll()).resolves.toEqual([])
        })
        test("Debe levantar un ConnectionError", async () => {
            productoModel.getAll.mockRejectedValueOnce(new ConnectionError)
            await expect(productoService.getAll()).rejects.toThrow(ConnectionError)
        })
    })
    describe("Para el metodo get", () => {
        test("Con funcionamiento correcto", async () => {
            productoModel.getById.mockResolvedValueOnce({})
            await expect(productoService.get(1)).resolves.toEqual({})
        })
        test("Con error", async () => {
            productoModel.getById = vi.fn().mockRejectedValueOnce(new ConnectionError)
            await expect(productoService.get(1)).rejects.throws(ConnectionError)
        })
    })
    describe("Para el metodo Update", () => {
        test("Con funcionamiento correcto", async () => {
            productoModel.getById = vi.fn().mockResolvedValue({...schemaProducto})
            imagenService.attachImageToProducto.mockResolvedValueOnce('/')
            productoModel.update.mockResolvedValueOnce()
            await expect(productoService.update({})).resolves.toEqual(schemaProducto)
        })
        test("Con error", async () => {
            productoModel.getById = vi.fn().mockRejectedValueOnce(new ConnectionError)
            await expect(productoService.update(1)).rejects.throws(ConnectionError)
        })
    })
    describe("Para el metodo delete", () => {
        test("Con funcionamiento correcto", async () => {
            productoModel.getById.mockResolvedValueOnce({})
            productoModel.delete.mockResolvedValueOnce()
            await expect(productoService.delete(1)).resolves.toBe(undefined)
        })
        test("Con error", async () => {
            productoModel.getById.mockRejectedValueOnce(new ConnectionError)
            await expect(productoService.delete(1)).rejects.toThrow(ConnectionError)
        })
    })
    describe("Para el metodo add", () => {
        test("Con funcionamiento correcto", async () => {
            productoModel.add.mockResolvedValueOnce(1)
            imagenService.attachImageToProducto.mockResolvedValueOnce('/')
            productoModel.update.mockResolvedValueOnce()
            productoModel.getById.mockResolvedValueOnce({...schemaProducto, imagenUrl : '/'})
            await expect(productoService.add(schemaProducto, 1)).resolves.toEqual(schemaProducto)
        })
        test("Con error", async () => {
            productoModel.add.mockRejectedValueOnce(new ConnectionError)
            await expect(productoService.add(1)).rejects.toThrow(ConnectionError)
        })
    })
})