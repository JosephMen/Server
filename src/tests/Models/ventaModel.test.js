import { describe, beforeEach, expect, test, vi, afterAll } from 'vitest'
import Venta from '../../models/venta.js'
const cliente = {
  query: vi.fn()
}
const data = {
  fechaRealizada: '2024-6-1',
  descripcion: 'life',
  clienteId: 1,
  total: 10.2,
  ganancia: 5,
  esCredito: false,
  dependienteId: 1,
  costo: 100
}

const dataFromDB = {
  id: 1,
  fecharealizada: new Date('6-1-2024'),
  descripcion: 'life',
  clienteid: 1,
  total: 10.2,
  ganancia: 5,
  escredito: false,
  dependienteid: 1,
  costo: 100
}

const updateSuccesfull = {
  rowCount: 1
}
const getSuccessfull = {
  ...data,
  fechaRealizada:
  '1/6/2024',
  id: 1
}

const addSuccessfull = {
  rows: [{ id: 1 }]
}
const deleteSuccesfull = {
  rowCount: 1
}
const getAllSuccessfull = {
  rowCount: 1,
  rows: [{ ...dataFromDB }]
}
const ventaModelo = new Venta({ cliente, logger: console.log })
describe.skip('test para el modelo de ventas', async () => {
  describe('Para el metodo de update', () => {
    test('debe devolver verdadero ante la entrada 1', async () => {
      // Arreglar
      cliente.query.mockResolvedValueOnce(updateSuccesfull)
      const datos = { ...data }
      const id = 1

      // Actuar
      const result = await ventaModelo.update({ id, datos })

      // Asertar
      expect(result).toBe(true)
    })

    test('debe devolver verdadero ante la entrada 2, con menos argumentos', async () => {
      // Arreglar
      cliente.query.mockResolvedValueOnce(updateSuccesfull)
      const datos = { descripcion: 'attack on titan' }
      const id = 1

      // Actuar
      const result = await ventaModelo.update({ id, datos })

      // Asertar
      expect(result).toBe(true)
    })
  })
  describe('Para el metodo add', () => {
    test('Debe devolver id igual a 1', async () => {
      // Arreglar
      cliente.query.mockResolvedValueOnce(addSuccessfull)
      const datos = { ...data }
      // Actuar
      const result = await ventaModelo.add({ datos })
      // Asertar
      expect(result).toBe(1)
    })

    test('Debe arrojar un error', async () => {
      // Arreglar
      const datos = { ...data }
      datos.fechaRealizada = '01/30/2024'
      const fun1 = async () => await ventaModelo.add({ datos })

      // Actuar

      // Asertar
      expect(fun1).rejects.toThrow()
    })
  })

  describe('Para el metodo get', () => {
    test('Debe devolver una lista con un objeto con id 1', async () => {
      // Arreglar
      const dataMock = { rows: [{ ...dataFromDB, id: 1 }], rowCount: 1 }
      const dataSuccess = { ...getSuccessfull }
      cliente.query.mockResolvedValueOnce(dataMock)

      // Actuar
      const result = await ventaModelo.get(1)

      // Asertar
      expect(result).toEqual(dataSuccess)
    })

    test('Debe devolver un schema de objeto como el que se le envia', async () => {
      // Arreglar
      const dataMock = { ...dataFromDB }
      const dataSuccesfull = { ...data, id: 1, fechaRealizada: '1/6/2024' }
      const getSucc = { ...getAllSuccessfull, rows: [dataMock] }
      cliente.query.mockResolvedValueOnce(getSucc)

      // Actuar
      const result = await ventaModelo.get(1)

      // Asertar
      expect(result).toEqual(dataSuccesfull)
    })
  })

  describe('Para el metodo delete', () => {
    test('Debe devolver verdadero', async () => {
      // Arreglar
      cliente.query.mockResolvedValueOnce(deleteSuccesfull)

      // Actuar
      const A = await ventaModelo.delete(1)

      // Asertar
      expect(A).toBe(true)
    })
  })

  describe('Para el metodo getAll', () => {
    test('Debe devolver una lista con elementos', async () => {
      // Arreglar
      const successData = [{ ...getSuccessfull }]
      cliente.query.mockResolvedValueOnce(getAllSuccessfull)

      // Actuar
      const B = await ventaModelo.getAll()

      // Asertar
      expect(B).toEqual(successData)
    })

    test('Debe devolver un schema de objeto como el que se le envia en add', async () => {
      // Arreglar
      const dataMock = { ...getAllSuccessfull }
      const dataSuccesfull = [{ ...getSuccessfull }]
      cliente.query.mockResolvedValueOnce(dataMock)

      // Actuar
      const result = await ventaModelo.getAll()

      // Asertar
      expect(result).toEqual(dataSuccesfull)
    })
  })
})
