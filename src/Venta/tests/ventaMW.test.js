/* eslint-disable */
import { describe, expect, test } from 'vitest'
import {validateBodyForAddVenta, validateBodyForUpdateVenta} from '../Middlewares/ventaMW'

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
describe.skip('Para los middlewares de validacion para ventaController', () => {
  describe('Para el metodo "validateBodyForAddVenta"', () => {
    test('Debe devolver el schema venta y lista de productoVenta validado y formateado a los schemas esperados', async () => {
      // Arreglar
      const res = { ...mockRes }
      const req = {
        body: {
          venta: { esCredito: true },
          listaProductos: [{ existenciaId: 1, cantidad: 2 }]
        }
      }

      // Actuar
      await validateBodyForAddVenta(req, res, next)

      // Asertar
      expect(req.body.ventaIn).toMatchObject({ esCredito: true})
      expect(req.body.productosVenta).toEqual([{ existenciaId: 1, cantidad: 2 }])
    })
    test('Debe arrojar un error (devolver 2) cuando el schema venta es incorrecto', async () => {
      // Arreglar
      const res = { ...mockRes }
      const req = {
        body: {
          venta: { esCredito: 'false' },
          listaProductos: [{ existenciaId: 1, cantidad: 2 }]
        }
      }

      // Actuar
      const result = await validateBodyForAddVenta(req, res, next)

      // Asertar
      expect(result, 'debe ser igual a 2').toBe(2)
    })
    test('Debe arrojar un error (devolver 2) cuando el schema listaProductos es incorrecto', async () => {
      // Arreglar
      const res = { ...mockRes }
      const req = {
        body: {
          venta: { esCredito: true },
          listaProductos: [{ existenciaId: 1, cantidad: 2 }, { existenciaId: 'false', cantidad: 2 }]
        }
      }

      // Actuar
      const result = validateBodyForAddVenta(req, res, next)

      // Asertar
      expect(result, 'debe ser igual a 2').toBe(2)
    })
  })
  describe('Para el metodo "validateBodyForUpdateVenta"', () => {
    test('Debe coincidir el resultado de req.body con el establecido', async () => {
      // Arreglar
      const ventaCorrecto = {esCredito: true, id: 1}
      const res = { ...mockRes }
      const req = {
        body: {
          venta: {esCredito: true},
          listaProductos: [{ existenciaId: 1, cantidad: 2 }]
        },
        params: {
          id: 1
        }
      }

      // Actuar
      await validateBodyForUpdateVenta(req, res, next)

      // Asertar
      expect(req.body.ventaIn).toMatchObject(ventaCorrecto)
    })

    test('Debe arrojar un error (devolver un 2)', async () => {
      // Arreglar
      const ventaCorrecto = {esCredito: true, id: 1}
      const res = { ...mockRes }
      const req = {
        body: {
          venta: {esCredito: 'true'},
          listaProductos: [{ existenciaId: 1, cantidad: 2 }]
        },
        params: {
          id: 1
        }
      }

      // Actuar
      const result = await validateBodyForUpdateVenta(req, res, next)

      // Asertar
      expect(result).toBe(2)
    })
    test('Debe arrojar un error (devolver un 2)', async () => {
      // Arreglar
      const res = { ...mockRes }
      const req = {
        body: {
          venta: {esCredito: true},
          listaProductos: [{ existenciaId: 'cero', cantidad: 2 }]
        },
        params: {
          id: 1
        }
      }

      // Actuar
      const result = await validateBodyForUpdateVenta(req, res, next)

      // Asertar
      expect(result).toBe(2)
    })

    test('Debe arrojar un error (devolver un 2) cuando el schema desde req no es valido', async () => {
      // Arreglar
      const res = { ...mockRes }
      const req = {
        body: {
          venta: { esCredito: true },
          listaProductos: [{ existenciaId: 1, cantidad: 'cero' }]
        },
        params: {
          id: 1
        }
      }

      // Actuar
      const result = await validateBodyForUpdateVenta(req, res, next)

      // Asertar
      expect(result).toBe(2)
    })

    test('Debe arrojar un error (devolver un 2) cuando el schema desde req no es valido', async () => {
      // Arreglar
      const res = { ...mockRes }
      const req = {
        body: {
          venta: {},
          listaProductos: [{ existenciaId: 4, cantidad: 2 }]
        },
        params: {
          id: 'cero'
        }
      }

      // Actuar
      await validateBodyForUpdateVenta(req, res, next)

      // Asertar
      expect(req.skip).toBe(true)
    })
  })
})
