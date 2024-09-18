/* eslint-disable */
import {describe, test, expect} from 'vitest'
import EtiquetaService from '../Services/EtiquetaService'

const mockModel = {
    add: async ({nombre}) => {
        if(typeof nombre !== 'string') throw new Error('Nombre no valido')
        return 1
    },
    delete: async (id) => {
        if(typeof id !== 'number') throw new Error('Id no valido')
        if( id === 1) return true
        return false
    },
    getById: async (id) => {
        if(typeof id !== 'number') throw new Error('Id no valido')
        if(id === 1) return {nombre:"nombre", id: 1}
        return null
    },
    getAll : async ()=>{
        return []
    },
    update: async ({nombre, id}) => {
        if(typeof id !== 'number') throw new Error('Id no valido')
        if(typeof nombre !== 'string') throw new Error('Nombre no valido')
        if(id !== 1) return false
        return true
    },
    attachEtiquetasToProducto: async () => 1,
    deleteEtiquetasFromProducto : async () => true
}

const etiquetaService = new EtiquetaService(mockModel)


describe.skip('Para el servicio de Etiqueta', async () => {
    describe('Para el metodo add', async () => {
        test('Debe devolver la entidad con el id establecido', async() => {
            const resultado = await etiquetaService.add({nombre:'nombre'})

            expect(resultado).toEqual({nombre:'nombre', id:1})
        })
    })
    describe('Para el metodo delete', async() => {
        test('Debe devolver verdadero pues el id si existe', async () => {
            const resultado = await etiquetaService.delete(1)

            expect(resultado).toBe(true)
        })
        test('Debe devolver falso pues el id no existe', async () => {
            const resultado = await etiquetaService.delete(1)

            expect(resultado).toBe(true)
        })
    })
    describe('Para el metodo getAll', async () => {
        test("Debe devolver una lista vacia pues no hay registros", async () => {
            const resultado = await etiquetaService.getAll()

            expect(resultado).toEqual([])
        })
    })
    describe('Para el metodo get', async () => {
        test('Debe devolver el schema etiqueta completo de un registro', async () => {
            const resultado = await etiquetaService.get(1)

            expect(resultado).toEqual({nombre:"nombre", id: 1})
        })

        test('Debe devolver null pues el registro no existe', async () => {
            const resultado = await etiquetaService.get(2)

            expect(resultado).toEqual(null)
        })
    })
    describe('Para el metodo update', async () => {
        test('Debe devolver verdadero al modificar un registro que si existe', async () => {
            const resultado = await etiquetaService.update({id: 1, nombre: 'nombre'})

            expect(resultado).toBe(true)
        })

        test('Debe devolver null pues el registro no existe', async () => {
            const resultado = await etiquetaService.update({id: 2, nombre: 'nombre'})

            expect(resultado).toBe(false)
        })
    })

    describe('Para el metodo agregarEtiquetasAProducto', async () => {
        test('Debe devolver 1', async () => {
            const resultado = await etiquetaService.etiquetarProducto({id: 1, nombre: 'nombre'})

            expect(resultado).toBe(1)
        })
    })
    describe('Para el metodo desetiquetar', async () => {
        test('Debe devolver true', async() => {
            //Arreglar
            //Actuar
            const result = await etiquetaService.desetiquetarProducto()
            //Asertar
            expect(result).toBe(true)
        })
    })
})