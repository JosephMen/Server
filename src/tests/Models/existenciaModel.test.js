/* eslint-disable */
import {vi, describe, test, expect, beforeEach, afterAll} from 'vitest'
import Existencia from '../../models/existencia'

const cliente = {
    query: vi.fn()
}
const response = {
    rowCount : 0,
    rows: []
}
const existenciaE = {
    id: 1, 
    productoid: 2,
    stock: 1,
    precio: 1,
    costo: 1,
    fechaentrada: new Date('1-20-2024'),
    fechamodificacion: new Date('1-20-2024')
}
const existenciaExpected = {
    id: 1, 
    productoId: 2,
    stock: 1,
    precio: 1,
    costo: 1,
    fechaEntrada: '20/1/2024',
    fechaModificacion: '20/1/2024'
}
const existencia = new Existencia({cliente})
describe.skip('Para el modelo de interaccion con BD "existencia" : ', () => {

    describe("Para la clase de existencia metodo getAll", () => {
        test("Debe retornar una lista vacia", async () => {
            //Arreglar 
            cliente.query.mockResolvedValue(response)
    
            //Actuar
            const resultado = await existencia.getAll()
    
            //assertar
            expect(resultado).toEqual([])
        })
    })
    describe("Para la clase de existencia metodo get", () => {
        test("Debe retornar un objeto", async () => {
            //Arreglar 
            const res = {...response}
            res.rows = [existenciaE]
            res.rowCount = 1
            cliente.query.mockResolvedValue(res)
            const expected = {...existenciaExpected}
    
            //Actuar
            const resultado = await existencia.get(1)
            //assertar
            expect(resultado).toEqual(expected)
        })
    })
    
    describe("Para la clase de existencia metodo update", () => {
        test("Debe retornar el valor booleano de true", async () => {
            //Arreglar 
            const res = {...response}
            const entrada = {...existenciaE}
            res.rows = [existenciaE]
            res.rowCount = 1
            cliente.query.mockResolvedValue(res)
    
            //Actuar
            const resultado = await existencia.update({datos: entrada})
    
            //assertar
            expect(resultado).toEqual(true)
        })
    })
    describe("Para la clase de existencia metodo add", () => {
        test("Debe retornar 1", async () => {
            //Arreglar 
            const res = {...response}
            const entrada = {...existenciaExpected}
            res.rows = [{id: 1}]
            res.rowCount = 1
            cliente.query.mockResolvedValue(res)
    
            //Actuar
            const resultado = await existencia.add({datos: entrada})
    
            //assertar
            expect(resultado).toEqual(1)
        })
    })
})