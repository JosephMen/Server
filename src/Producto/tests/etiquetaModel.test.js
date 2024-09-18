/* eslint-disable */
import Cliente from "../../connection";
import EtiquetaModel from "../Model/etiqueta";
import ProductoModel from "../Model/producto";
import { describe, beforeEach,expect, test, vi, afterAll } from 'vitest'

const etiquetaModel = new EtiquetaModel(Cliente, console.log)
const productoModel = new ProductoModel({cliente: Cliente})
describe.skip("Para el metodo add", () => {
    test('Con entradas correctas', async() => {
        await expect(etiquetaModel.add({nombre: 'etiqueta de prueba'})).resolves.toBeTypeOf('number')
    })
})
describe.skip('Para el metodo delete', () => {
    test('Con entradas correctas', async () => {
        const id = await etiquetaModel.add({nombre: 'etiqueta de prueba'})
        await expect(etiquetaModel.delete(id)).resolves.toBe(true)
    })
    test('Con un registro que no existe', async () => {
        const id = -1
        await expect(etiquetaModel.delete(id)).resolves.toBe(false)
    })
})
describe.skip('Para el metodo update', () => {
    test("Con un registro que existe", async() => {
        const entidad = {nombre: 'etiqueta'}
        const id = await etiquetaModel.add(entidad)
        entidad.id = id
        entidad.nombre = 'etiquetamodificada2'
        await expect(etiquetaModel.update(entidad)).resolves.toBe(true)
    })
    test("Con un registro que existe", async() => {
        const entidad = {nombre:'entidad', id:-1}
        await expect(etiquetaModel.update(entidad)).resolves.toBe(false)
    })
})
describe.skip('Para el metodo get', () => {
    test('Para un registro que existe', async () => {
        expect(etiquetaModel.getById(9)).resolves.toEqual({id:9, nombre:'etiqueta modificada'})
    })
    test('Para un registro que no existe', async () => {
        expect(etiquetaModel.getById(-1)).resolves.toBe(null)
    })
})
describe.skip('Para el metodo getAll', () => {
    test('Sin errores', async() => {
        await expect(etiquetaModel.getAll()).resolves.toBeInstanceOf(Array)
    })
})
const ids = {
    id1: null,
    id2: null
}
describe.skip('Para el metodo attachEtiquetasToProducto',() =>{
    test('Agregar ids de etiquetas que no existen debe devolver error', async () => {
        const fun1 = async () => {
            await etiquetaModel.attachEtiquetasToProducto([20,30,40], -1)
        }
        expect(async () => {await fun1()}).rejects.Throw()
    })

    test('Unir 2 etiquetas a un producto debe devolver 1', async () => {
        //Preparar
        const etiqueta1 = {nombre: 'etiqueta1'}
        const etiqueta2 = {nombre: 'etiqueta2'}
        const productoId = 57
        
        const id1 = await etiquetaModel.add(etiqueta1)
        const id2 = await etiquetaModel.add(etiqueta2)
        ids.id1 = id1
        ids.id2 = id2

        // Actuar
        const valor = await etiquetaModel.attachEtiquetasToProducto([id1, id2], productoId)

        //Esperar
        expect(valor).toBe(1)

    })
    afterAll(async ()=>{
        if(ids.id1) await etiquetaModel.delete(ids.id1)
        if(ids.id2) await etiquetaModel.delete(ids.id2)
    })
})
describe.skip('Para el metodo deleteEtiquetaFromProducto', () => {
    const toDelete = {
        id: null,
        idProducto: null
    }
    test('Debe devolver falso pues los registros no existen', async () => {

        const result = await etiquetaModel.deleteEtiquetasFromProducto([-1],-1)

        expect(result).toBe(true)
    })

    test('Debe devolver verdadero pues las etiquetas si existen', async() => {
        //Arreglar
        const productoId = await productoModel.add({nombre : 'producto Prueba', codigo: 'nada', descripcion: 'nada'})
        const etiquetaid = await etiquetaModel.add({nombre: 'etiqueta$'})
        toDelete.id = etiquetaid
        toDelete.idProducto = productoId
        await etiquetaModel.attachEtiquetasToProducto([etiquetaid], productoId)

        //Actuar
        const result = await etiquetaModel.deleteEtiquetasFromProducto([etiquetaid], productoId)

        //Asertar
        expect(result).toBe(true)
    })
    afterAll(async() => {
        if(toDelete.id) await etiquetaModel.delete(toDelete.id)
        if(toDelete.idProducto) await productoModel.delete(toDelete.idProducto)
    })
})
describe.skip('Para el metodo "Existe"', () => {
    test('Debe devolver verdadero pues el nombre de etiqueta ya existe', async () => {
        // Arregar

        // Actuar 
        const existe = await etiquetaModel.existe('etiqueta1')

        // Asertar
        expect(existe).toBe(true)
    })
    test('Debe devolver false pues la etiqueta no existe', async () => {
        // Arregar

        // Actuar 
        const existe = await etiquetaModel.existe('noExiste')

        // Asertar
        expect(existe).toBe(false)
    })
})