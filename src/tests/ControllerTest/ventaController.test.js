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
describe('Para la clase "VentaController"', () => {
    describe('Paa el metodo "addVentaIn"', () => {
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
            await ventaController.addVenta(req, res, next)

            // Asertar
            expect(res.jsonResult).toMatchObject({data: valueReturn})
        })
    })
    describe('Paa el metodo "updateVentaIn"', () => {
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
            await ventaController.updateVenta(req, res, next)

            // Asertar
            expect(res.jsonResult).toMatchObject({data: valueReturn})
        })
    })

    describe('Paa el metodo "validateVentaIn"', () => {
        test('Debe devolver el schema venta y lista de productoVenta validado y formateado a los schemas esperados', async () => {
            // Arreglar
            const res = {...mockRes}
            const req = {
                body: {
                    venta: {esCredito: true},
                    listaProductos: [{existenciaId: 1, cantidad: 2}]
                }
            }

            // Actuar
            await ventaController.validateVentaReq(req, res, next)

            // Asertar
            expect(req.body.venta).toMatchObject({esCredito: true, descripcion: ''})
            expect(req.body.listaProductos).toEqual([{existenciaId: 1, cantidad: 2}])
        })
        test('Debe arrojar un error (devolver 2) cuando el schema venta es incorrecto', async () => {
            // Arreglar
            const res = {...mockRes}
            const req = {
                body: {
                    venta: {esCredito: 'false'},
                    listaProductos: [{existenciaId: 1, cantidad: 2}]
                }
            }

            // Actuar
            const result = await ventaController.validateVentaReq(req, res, next)

            // Asertar
            expect(result, 'debe ser igual a 2').toBe(2)
        })
        test('Debe arrojar un error (devolver 2) cuando el schema listaProductos es incorrecto', async () => {
            // Arreglar
            const res = {...mockRes}
            const req = {
                body: {
                    venta: {esCredito: true},
                    listaProductos: [{existenciaId: 1, cantidad: 2}, {existenciaId: 'false', cantidad: 2}]
                }
            }

            // Actuar
            const result = await ventaController.validateVentaReq(req, res, next)

            // Asertar
            expect(result, 'debe ser igual a 2').toBe(2)
        })

    })
    describe('Para el metodo "validateUpdateVentaIn"', () => {
        test('Debe arrojar un error (devolver un 2)', async () => {
            // Arreglar
            const res = {...mockRes}
            const req = {
                body: {
                    listaProductos: [{existenciaId: 'cero', cantidad: 2}]
                },
                params: {
                    id: 1
                }
            }

            // Actuar
            const result = await ventaController.validateUpdateVentaReq(req, res, next)

            // Asertar
            expect(result).toBe(2)
        })

        test('Debe arrojar un error (devolver un 2) cuando el schema desde req no es valido', async () => {
            // Arreglar
            const res = {...mockRes}
            const req = {
                body: {
                    venta: {esCredito: 1},
                    listaProductos: [{existenciaId: 1, cantidad: 'cero'}]
                },
                params: {
                    id: 1
                }
            }

            // Actuar
            const result = await ventaController.validateUpdateVentaReq(req, res, next)

            // Asertar
            expect(result).toBe(2)
        })

        test('Debe arrojar un error (devolver un 2) cuando el schema desde req no es valido', async () => {
            // Arreglar
            const res = {...mockRes}
            const req = {
                body: {
                    listaProductos: [{existenciaId: 4, cantidad: 2}]
                },
                params: {
                    id: 'cero'
                }
            }

            // Actuar
            const result = await ventaController.validateUpdateVentaReq(req, res, next)

            // Asertar
            expect(result).toBe(2)
        })
    })
})