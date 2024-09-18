import { describe, expect, test } from 'vitest'
import ventaSchema, { ventaSchemaUtil } from '../Schemas/ventaSchema'
import { validateArrayVentaInSchema, validateArrayProdVInSchema } from '../Schemas/ventaInSchema'
import dateFormat from '../../Common/utils/dateFormat'
const objeto = {
  id: 1,
  fechaRealizada: '2024/01/01',
  descripcion: 'descripcion',
  clienteId: 1,
  total: 10.2,
  ganancia: 2.2,
  esCredito: false,
  dependienteId: 1
}
const ventaUtil = { ...ventaSchemaUtil }
describe.skip('Test para validar schema de ventas', () => {
  test('El siguiente schema debe devolver un objeto con succes en true', () => {
    // Arreglar
    const obj = { ...objeto }
    // Actuar
    const evaluar = () => ventaSchema.safeParse(obj)

    // Asertar
    expect(evaluar).not.throw()
    expect(evaluar().success).toBe(true)
  })
  test('El siguiente schema debe devolver un objeto con succes en false', () => {
    // Arreglar
    const obj = { ...objeto }
    obj.fechaRealizada = '31/01/2024'
    obj.esCredito = false
    // obj.fechaRealizada = undefined
    // Actuar
    const evaluar = () => ventaSchema.safeParse(obj)
    const errores = ventaSchema.safeParse(obj)
    // Asertar
    expect(evaluar).not.throw()
    expect(errores.success).toBe(true)
  })
  test('Debe rellenar por defecto el campo de fechaRealizada con la fecha de hoy', () => {
    // Arreglar
    const obj = { ...objeto }
    const fechaHoy = dateFormat(new Date().toLocaleDateString('es-MX'))
    obj.esCredito = undefined
    obj.fechaRealizada = undefined
    // Actuar
    const parse = ventaSchema.safeParse(obj)
    const fechaObtenida = parse.success ? parse.data.fechaRealizada : undefined
    // Asertar
    expect(fechaObtenida).toBe(fechaHoy)
  })
  test('Debe setear las propiedades de costo, total y ganancia a su valor esperado', () => {
    // Arreglar
    const prueba = { ...ventaUtil }
    const prod1 = { costoTotal: 10, gananciaTotal: 10, precioTotal: 20 }
    const prod2 = { costoTotal: 10, gananciaTotal: 20, precioTotal: 30 }
    const esperado = { costo: 20, ganancia: 30, total: 50 }
    // Actuar
    prueba.addProductoVenta(prod1)
    prueba.addProductoVenta(prod2)

    // Asertar
    expect(prueba).toMatchObject(esperado)
  })
  test('Debe setear las propiedades de costo, total y ganancia a su valor esperado', () => {
    // Arreglar
    const prueba = { ...ventaUtil }
    const prod1 = { costoTotal: 10, gananciaTotal: 10, precioTotal: 20 }
    const prod2 = { costoTotal: 10, gananciaTotal: 20, precioTotal: 30 }
    const esperado = { costo: 10, ganancia: 10, total: 20 }
    // Actuar
    prueba.addProductoVenta(prod1)
    prueba.addProductoVenta(prod2)
    prueba.removeProdVenta(prod2)

    // Asertar
    expect(prueba).toMatchObject(esperado)
  })
  describe.skip('Para el metodo de validacion "validateListaProductoInSchema"', () => {
    test('Debe validar la lista de productos como correctos', () => {
      // Arreglar
      const objeto = [{ existenciaId: 1, cantidad: 1 }, { existenciaId: 1, cantidad: 1 }]
      // Actuar

      // Asertar
      expect(() => validateArrayProdVInSchema(objeto)).not.toThrow()
    })

    test('Debe validar la lista de productos como correctos', () => {
      // Arreglar
      const objeto = [{ existenciaId: 1, cantidad: 'world' }, { existenciaId: 'hello', cantidad: 1 }]
      // Actuar

      // Asertar
      expect(() => validateArrayProdVInSchema(objeto)).toThrow()
    })
  })

  describe('Para el metodo de validacion "validateListaProductoInSchema"', () => {
    test('Debe validar la lista de productos como correctos', () => {
      // Arreglar
      const obj1 = { descripcion: '', esCredito: true, dependienteId: 0, clienteId: 1 }
      const obj2 = { descripcion: '', esCredito: true, dependienteId: 0 }
      const obj3 = { esCredito: true }
      const obj4 = { descripcion: '', esCredito: true, dependienteId: 0, clienteId: 1 }
      const objeto = [obj1, obj2, obj3, obj4]
      // Actuar

      // Asertar
      expect(() => validateArrayVentaInSchema(objeto)).not.toThrow()
    })

    test('Debe validar la lista de productos como correctos', () => {
      // Arreglar
      const objeto = [{ existenciaId: 1, cantidad: 'world', esCredito: 'hola' }, { existenciaId: 'hello', cantidad: 1 }]
      const funcion = () => {
        validateArrayVentaInSchema(objeto)
      }
      // Actuar

      // Asertar
      expect(funcion).toThrow()
    })
  })
})
