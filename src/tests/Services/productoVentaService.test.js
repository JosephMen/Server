/* eslint-disable */
import { vi, describe, test, expect, beforeEach } from 'vitest'
import ProductoVentaService from '../../services/productoVentaService'
const sended = {
  existenciaId: 1,
  cantidad: 2,
  ventaId: 3
}
const expected = {
  existenciaId: 1,
  cantidad: 2,
  ventaId: 3,
  costoUnitario: 4,
  precioUnitario: 5,
  costoTotal: 8,
  gananciaTotal: 2,
  precioTotal: 10
}
const productoVentaModelo = {
  get: vi.fn(),
  add: vi.fn(),
  delete: vi.fn(),
  getAll: vi.fn(),
  update: vi.fn()
}
const existencia = {
    costo: 4,
    precio: 5
}
const productoVentaService = new ProductoVentaService({ productoVentaModelo })
describe.skip('Para la clase productoVentaService', () => {
  describe('Para el metodo "agregar"', () => {
    test('Debe retornar un schema de objeto como el establecido', async () => {
      // Arreglar
      // Actuar
      const result = await productoVentaService.agregar({productoVentaIn: sended, existencia, cliente: null})
      // Asertar
      expect(result).toMatchObject(expected)
    })
  })
  describe('Para el metodo "obtener"', () => {
    test('Debe retornar un objeto como el establecido como esperado ', async () => {
      //Arreglar
      productoVentaModelo.get.mockResolvedValueOnce({...expected})

      //Actuar
      const resultado = await productoVentaService.obtener({ventaId: 1, existenciaId: 1})

      //Asertar
      expect(resultado, 'mensaje random').toMatchObject({...expected})
    })

    describe('Para el metodo eliminar', () => {
      test('Debe devolver verdadero', async () => {
        //Arreglar 
        productoVentaModelo.delete.mockResolvedValueOnce(true)
        //Actuar
        const result = await productoVentaService.eliminar({})
        //Asertar
        expect(result).toBe(true)
      })
    })

    //Arreglar
    //Actuar
    //Asertar
    describe('Para el metodo "actualizar"', () => {
      test('debe devolver el objeto establecido como esperado', async () => {
        //Arreglar
        const esperado = {...expected, cantidad: 1, gananciaTotal: 1, costoTotal: 4, precioTotal: 5}
        const prodVIn = {cantidad: 1}
        const prodVAct = {...expected}
        //Actuar
        const result = await productoVentaService.actualizar({prodVIn, prodVAct})
        //Asertar
        expect(result).toMatchObject(esperado)
      })
    })

    describe('Para el metodo "obtenerTodos"', () => {
      test('debe devolver un objeto establecido como el esperado', async () => {
        //Arreglar
        const esperado = [{...expected}]
        productoVentaModelo.getAll.mockResolvedValueOnce(esperado)

        //Actuar
        const result = await productoVentaService.obtenerTodos({ventaId: 1})

        //Asertar
        for (const res of result){
          expect(res).toMatchObject(expected)
        }
      })
    })
  })
})
