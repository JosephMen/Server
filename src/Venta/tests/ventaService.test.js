import { vi, describe, test, expect, beforeEach } from 'vitest'
import VentaService from '../services/VentaService'
import { productoVentaSchemaUtil } from '../../Producto/Schemas/productoVentaSchema'
import { ventaSchemaUtil } from '../Schemas/ventaSchema'

const cliente = {
  query: vi.fn().mockResolvedValue({}),
  release: vi.fn(() => 1)
}
const ventaModelo = {
  add: vi.fn().mockResolvedValue(1),
  update: vi.fn(),
  get: vi.fn(),
  getClient: vi.fn().mockResolvedValue(cliente)
}
const productoVentaSer = {
  obtener: vi.fn(),
  agregar: vi.fn(),
  obtenerTodos: vi.fn(),
  actualizar: vi.fn(),
  eliminar: vi.fn()
}
const existenciaSer = {
  obtener: vi.fn(),
  actualizar: vi.fn()
}
const ventaService = new VentaService({ ventaModelo, productoVentaSer, existenciaSer })
const ventaIn = {
  clienteId: null,
  esCredito: true,
  dependienteId: 1,
  descripcion: 'una cabra'
}
const ventaExpected = {
  id: 1,
  descripcion: 'una cabra',
  clienteId: null,
  total: 2,
  ganancia: 1,
  esCredito: true,
  dependienteId: 1,
  costo: 1
}
const prodVIn = {
  cantidad: 1,
  existenciaId: 1
}
const existenciaEntity = {
  id: 1,
  productoId: 1,
  costo: 1,
  precio: 2,
  stock: 5,
  fechaEntrada: '1/6/2024',
  fechaModificacion: '1/6/2024'
}

const productoVentaEntity = {
  ventaId: 1,
  existenciaId: 1,
  cantidad: 1,
  precioTotal: 2,
  precioUnitario: 2,
  costoUnitario: 1,
  costoTotal: 1,
  gananciaTotal: 1
}

const productoVentaEntity2 = {
  ventaId: 1,
  existenciaId: 2,
  cantidad: 10,
  precioTotal: 100,
  precioUnitario: 10,
  costoUnitario: 1,
  costoTotal: 10,
  gananciaTotal: 90
}

const productoVentaEntity3 = {
  ventaId: 1,
  existenciaId: 3,
  cantidad: 20,
  precioTotal: 100,
  precioUnitario: 5,
  costoUnitario: 4,
  costoTotal: 80,
  gananciaTotal: 20
}
// Arreglar

// Actuar

// Asertar
describe.skip('Para la clase ventaService', () => {
  describe('Para el metodo "add"', () => {
    test('Debe retonar un schema de objeto como el establecido', async () => {
      // Arreglar
      existenciaSer.obtener.mockResolvedValueOnce({ ...existenciaEntity })
      productoVentaSer.agregar.mockResolvedValueOnce({ ...productoVentaEntity })
      const objectExpected = { venta: { ...ventaExpected }, productosVenta: [{ ...productoVentaEntity }] }
      // Actuar
      const result = await ventaService.add({ ventaIn: { ...ventaIn }, productosVenta: [{ ...productoVentaEntity }] })
      // Asertar
      expect(result).toMatchObject(objectExpected)

      // expect({ hola: 1, mundo: 2 }).toMatchObject({ hola: 1 })
    })
  })
  describe('Para el metodo "addTransact"', () => {
    test('Debe retonar un schema de objeto como el establecido', async () => {
      // Arreglar
      existenciaSer.obtener.mockResolvedValueOnce({ ...existenciaEntity })
      productoVentaSer.agregar.mockResolvedValueOnce({ ...productoVentaEntity })
      const objectExpected = { venta: { ...ventaExpected }, productosVenta: [{ ...productoVentaEntity }] }
      // Actuar
      const result = await ventaService.addTransact({ ventaIn: { ...ventaIn }, productosVenta: [{ ...productoVentaEntity }] })
      // Asertar
      expect(result).toMatchObject(objectExpected)
    })
  })
  describe('Para el metodo "update"', () => {
    test('Debe devolver la venta actualizada  (2 elementos a actualizar)', async () => {
      // Arreglar
      const arrayResult = [{ ...productoVentaEntity }, { ...productoVentaEntity2 }]
      const prodVListIn = [{ existenciaId: 1, cantidad: 10 }, { existenciaId: 2, cantidad: 5 }]
      existenciaSer.obtener.mockResolvedValue({ stock: 100 })
      productoVentaSer.obtenerTodos.mockResolvedValueOnce(arrayResult)
      productoVentaSer.actualizar.mockImplementation(async ({ prodVIn, prodVAct }) => {
        const result = { ...productoVentaSchemaUtil, ...prodVAct, ...prodVIn }
        result.autoCalculo()
        return result
      })
      const ventaAct = { ...ventaSchemaUtil }
      ventaAct.addProductoVenta(productoVentaEntity)
      ventaAct.addProductoVenta(productoVentaEntity2)

      ventaModelo.get.mockResolvedValueOnce({ ...ventaAct })

      const ventaExpected = { ...ventaAct, id: 2 }
      ventaExpected.costo = 15
      ventaExpected.total = 70
      ventaExpected.ganancia = 55

      const ventaIn = { id: 2 }
      // Actuar
      const result = await ventaService.update({ ventaIn, productosVenta: prodVListIn })

      // Asertar
      expect(result).toMatchObject(ventaExpected)
    })
    test('Debe devolver la venta actualizada (3 elementos a actualizar)', async () => {
      // Arreglar
      const arrayResult = [{ ...productoVentaEntity }, { ...productoVentaEntity2 }, { ...productoVentaEntity3 }]
      const prodVListIn = [{ existenciaId: 1, cantidad: 10 }, { existenciaId: 2, cantidad: 5 }, { existenciaId: 3, cantidad: 2 }]
      existenciaSer.obtener.mockResolvedValue({ stock: 100 })
      productoVentaSer.obtenerTodos.mockResolvedValue(arrayResult)
      productoVentaSer.actualizar.mockImplementation(async ({ prodVIn, prodVAct }) => {
        const result = { ...productoVentaSchemaUtil, ...prodVAct, ...prodVIn }
        result.autoCalculo()
        return result
      })
      const ventaAct = { ...ventaSchemaUtil }
      ventaAct.addProductoVenta(productoVentaEntity)
      ventaAct.addProductoVenta(productoVentaEntity2)
      ventaAct.addProductoVenta(productoVentaEntity3)

      ventaModelo.get.mockResolvedValueOnce(ventaAct)

      const ventaExpected = { ...ventaAct, id: 1, esCredito: false }
      ventaExpected.costo = 23
      ventaExpected.total = 80
      ventaExpected.ganancia = 57

      const ventaIn = { id: 1, esCredito: false }

      // Actuar
      const result = await ventaService.update({ ventaIn, productosVenta: prodVListIn })

      // Asertar
      expect(result).toMatchObject(ventaExpected)
    })
    test('Debe devolver la venta actualizada (1 elemento nuevo)', async () => {
      // Arreglar
      const arrayResult = []
      const prodVListIn = [{ existenciaId: 1, cantidad: 1 }]
      existenciaSer.obtener.mockResolvedValue({ ...existenciaEntity })
      productoVentaSer.obtenerTodos.mockResolvedValueOnce(arrayResult)
      productoVentaSer.actualizar.mockImplementation(async ({ prodVIn, prodVAct }) => {
        const result = { ...productoVentaSchemaUtil, ...prodVAct, ...prodVIn }
        result.autoCalculo()
        return result
      })
      const ventaAct = { ...ventaSchemaUtil }

      ventaModelo.get.mockResolvedValueOnce(ventaAct)

      const ventaExpected = { ...ventaAct }
      ventaExpected.costo = 1
      ventaExpected.total = 2
      ventaExpected.ganancia = 1
      const ventaIn = { id: 1 }
      // Actuar
      const result = await ventaService.update({ ventaIn, productosVenta: prodVListIn })

      // Asertar
      expect(result).toMatchObject(ventaExpected)
    })

    test('Debe devolver la venta actualizada (1 elemento a remover)', async () => {
      // Arreglar
      const arrayResult = [{ ...productoVentaEntity }, { ...productoVentaEntity2 }]
      const prodVListIn = [{ existenciaId: 1, cantidad: 1 }]
      existenciaSer.obtener.mockResolvedValue({ ...existenciaEntity })
      productoVentaSer.obtenerTodos.mockResolvedValueOnce(arrayResult)
      productoVentaSer.actualizar.mockImplementation(async ({ prodVIn, prodVAct }) => {
        const result = { ...productoVentaSchemaUtil, ...prodVAct, ...prodVIn }
        result.autoCalculo()
        return result
      })
      const ventaAct = { ...ventaSchemaUtil }
      ventaAct.addProductoVenta(productoVentaEntity)
      ventaAct.addProductoVenta(productoVentaEntity2)
      ventaModelo.get.mockResolvedValueOnce(ventaAct)

      const ventaExpected = { ...ventaAct }
      ventaExpected.costo = productoVentaEntity.costoUnitario * 1
      ventaExpected.total = productoVentaEntity.precioUnitario * 1
      ventaExpected.ganancia = ventaExpected.total - ventaExpected.costo
      const ventaIn = { id: 1 }
      // Actuar
      const result = await ventaService.update({ ventaIn, productosVenta: prodVListIn })

      // Asertar
      expect(result).toMatchObject(ventaExpected)
    })

    test('Debe devolver la venta actualizada (1 elemento a remover y uno a actualizar)', async () => {
      // Arreglar
      const arrayResult = [{ ...productoVentaEntity }, { ...productoVentaEntity2 }]
      const prodVListIn = [{ existenciaId: 1, cantidad: 6 }]
      existenciaSer.obtener.mockResolvedValue({ ...existenciaEntity })
      productoVentaSer.obtenerTodos.mockResolvedValueOnce(arrayResult)
      productoVentaSer.actualizar.mockImplementation(async ({ prodVIn, prodVAct }) => {
        const result = { ...productoVentaSchemaUtil, ...prodVAct, ...prodVIn }
        result.autoCalculo()
        return result
      })
      const ventaAct = { ...ventaSchemaUtil }
      ventaAct.addProductoVenta(productoVentaEntity)
      ventaAct.addProductoVenta(productoVentaEntity2)
      ventaModelo.get.mockResolvedValueOnce(ventaAct)

      const ventaExpected = { ...ventaAct }
      ventaExpected.costo = productoVentaEntity.costoUnitario * 6
      ventaExpected.total = productoVentaEntity.precioUnitario * 6
      ventaExpected.ganancia = ventaExpected.total - ventaExpected.costo

      const ventaIn = { id: 1 }

      // Actuar
      const result = await ventaService.update({ ventaIn, productosVenta: prodVListIn })

      // Asertar
      expect(result).toMatchObject(ventaExpected)
    })
    test('Debe devolver la venta actualizada (sin cambios)', async () => {
      // Arreglar
      const arrayResult = [{ ...productoVentaEntity }]
      const prodVListIn = [{ existenciaId: 1, cantidad: 1 }]
      existenciaSer.obtener.mockResolvedValue({ ...existenciaEntity })
      productoVentaSer.obtenerTodos.mockResolvedValueOnce(arrayResult)
      productoVentaSer.actualizar.mockImplementation(async ({ prodVIn, prodVAct }) => {
        const result = { ...productoVentaSchemaUtil, ...prodVAct, ...prodVIn }
        result.autoCalculo()
        return result
      })
      const ventaAct = { ...ventaSchemaUtil }
      ventaAct.addProductoVenta({ ...productoVentaEntity })
      ventaModelo.get.mockResolvedValueOnce(ventaAct)

      const ventaExpected = { ...ventaAct }
      const ventaIn = { id: 1 }
      // Actuar
      const result = await ventaService.update({ ventaIn, productosVenta: prodVListIn })

      // Asertar
      expect(result).toMatchObject(ventaExpected)
    })
  })
  describe('Para el metodo "updateTransact"', () => {
    test('Debe devolver la venta actualizada  (2 elementos a actualizar)', async () => {
      // Arreglar
      const arrayResult = [{ ...productoVentaEntity }, { ...productoVentaEntity2 }]
      const prodVListIn = [{ existenciaId: 1, cantidad: 10 }, { existenciaId: 2, cantidad: 5 }]
      existenciaSer.obtener.mockResolvedValue({ stock: 100 })
      productoVentaSer.obtenerTodos.mockResolvedValueOnce(arrayResult)
      productoVentaSer.actualizar.mockImplementation(async ({ prodVIn, prodVAct }) => {
        const result = { ...productoVentaSchemaUtil, ...prodVAct, ...prodVIn }
        result.autoCalculo()
        return result
      })
      const ventaAct = { ...ventaSchemaUtil }
      ventaAct.addProductoVenta(productoVentaEntity)
      ventaAct.addProductoVenta(productoVentaEntity2)

      ventaModelo.get.mockResolvedValueOnce(ventaAct)

      const ventaExpected = { ...ventaAct }
      ventaExpected.costo = 15
      ventaExpected.total = 70
      ventaExpected.ganancia = 55
      const ventaIn = { id: 1 }
      // Actuar
      const result = await ventaService.updateTransact({ ventaIn, productosVenta: prodVListIn })

      // Asertar
      expect(result).toMatchObject(ventaExpected)
    })
  })
})
