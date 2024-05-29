/* eslint-disable */
import {vi, describe, test, expect, beforeEach} from 'vitest'
import ImagenService from '../../services/imagenService'

const imagenModel = {
    countImagesByProducto: vi.fn(),
    countImagesByUsuario: vi.fn(),
    add: vi.fn(),
    updateByUsuario: vi.fn(),
    updateByProducto: vi.fn(),
    getIdByUsuario: vi.fn(),
    getIdByProducto: vi.fn(),
    update: vi.fn()
}
const imagenRelacion = {
    countImagenes: vi.fn(),
    getImagenId: vi.fn(),
    addImagen: vi.fn(),
    deleteImagen: vi.fn()
}
const imagen = {name: null, data: null, mimetype: null}
const imagenService = new ImagenService(imagenModel, imagenRelacion)
describe.skip("Para el metodo attachImageToUsuario", () => {
    test("Con entradas validas para un USUARIO existente", async () => {
        imagenModel.countImagesByUsuario.mockResolvedValueOnce(1)
        imagenModel.updateByUsuario.mockResolvedValueOnce(1)
        imagenModel.getIdByUsuario.mockResolvedValueOnce(2)
        await expect(imagenService.attachImageToUsuario(imagen,1)).resolves.toBe('imagen/2')
    })
    test("Con entradas validas para un USUARIO que no posee imagen", async () => {
        imagenModel.countImagesByUsuario.mockResolvedValueOnce(0)
        imagenModel.add.mockResolvedValueOnce(2)
        await expect(imagenService.attachImageToUsuario(imagen,1)).resolves.toBe('imagen/2')
    })
})

describe.skip("Para el metodo attachImageToProducto", () => {
    test("Con entradas validas para un PRODUCTO existente", async () => {
        imagenModel.countImagesByProducto.mockResolvedValueOnce(1)
        imagenModel.updateByProducto.mockResolvedValueOnce(1)
        imagenModel.getIdByProducto.mockResolvedValueOnce(2)
        await expect(imagenService.attachImageToProducto(imagen,1)).resolves.toBe('imagen/2')
    })
    test("Con entradas validas para un PRODUCTO que no posee imagen", async () => {
        imagenModel.countImagesByProducto.mockResolvedValueOnce(0)
        imagenModel.add.mockResolvedValueOnce(2)
        await expect(imagenService.attachImageToProducto(imagen,1)).resolves.toBe('imagen/2')
    })
})

describe.skip("Para el metodo addResto", () => {
    test('Con entradas validas debe devolver un string', async () => {
        //Arreglar
        imagenRelacion.countImagenes.mockResolvedValueOnce(1)
        imagenRelacion.getImagenId.mockResolvedValueOnce(1)
        imagenModel.update.mockResolvedValueOnce(true)
        const imagen = {
            name: 'nada',
            data: null,
            mimetype: 'nada'
        }
        //Actuar
        const resultado = await imagenService.addResto('marca',1, imagen)
        //Asertar
        expect(resultado).toBe('imagen/1')
    })
    test('Con entradas validas pero un escenario diferente debe devolver un string', async () => {
        //Arreglar
        imagenRelacion.countImagenes.mockResolvedValueOnce(0)
        imagenModel.add.mockResolvedValueOnce(1)
        imagenRelacion.addImagen.mockResolvedValueOnce(true)
        const imagen = {
            name: 'nada',
            data: null,
            mimetype: 'nada'
        }
        //Actuar
        const resultado = await imagenService.addResto('marca',1, imagen)
        //Asertar
        expect(resultado).toBe('imagen/1')
    })
})