/* eslint-disable */
import { vi, describe, test, expect, beforeEach, assert } from 'vitest'
import VentaController from '../../controllers/ventaController'
const ventaService = {
    updateTransact: vi.fn(),
    addTransact: vi.fn()
}

const mockRes = {
    jsonResult: null,
    json(param){
        this.jsonResult = param
    }
}
const next = (param) => {
    if (param instanceof Error) return 2
    return 1
}
const ventaController = new VentaController({ventaService})
const req = {}
describe.skip('Para la clase "VentaController"', () => {
    describe('Para el metodo "add"', () => {
        test('Debe devolver un objeto tal como se le proporciona desde el servicio', async () => {
            // Arreglar
            const res = {...mockRes}
            const req = {
                body: {
                    venta: {},
                    listaProductos: []
                }
            }
            const valueReturn = {data: 1}
            ventaService.addTransact.mockResolvedValue(valueReturn)

            // Actuar
            await ventaController.add(req, res, next)

            // Asertar
            expect(res.jsonResult).toMatchObject({data: valueReturn})
        })
    })
    describe('Paa el metodo "update"', () => {
        test('Debe devolver un objeto tal como se le proporciona desde el servicio', async () => {
            // Arreglar
            const res = {...mockRes}
            const req = {
                body: {
                    ventaId: 1,
                    listaProductos: []
                }
            }
            const valueReturn = {data: 1}
            ventaService.updateTransact.mockResolvedValue(valueReturn)

            // Actuar
            await ventaController.update(req, res, next)

            // Asertar
            expect(res.jsonResult).toMatchObject({data: valueReturn})
        })
    })

})