/* eslint-disable */
import {vi, describe, test, expect, beforeEach, afterAll} from 'vitest'
import ImagenRelacion from '../Model/imagen-relacion'
import Cliente from '../../connection'

const imagenRelacion =  new ImagenRelacion({Cliente})

describe.skip('Para el modelo de imagenRelacion', () => {
    describe('Para el metodo getImagenId ', () => {
        test('Debe devolver 36', async () => {
            //Arreglar
            const entidad = 'categoria'
            const id = 1
            //Actuar
            const imagenId = await imagenRelacion.getImagenId({entidad, id})
            //Asertar
            expect(imagenId).toBe(36)
        })
    })
    describe('Para el metodo countImagenes', () => {
        test('Debe devolver 1', async () => {
            //Arreglar
            const entidad = 'categoria'
            const id = 1
            //Actuar
            const cantidad = await imagenRelacion.countImagenes({entidad, id})
            //Asertar
            expect(cantidad).toBe(1)

        })
    })
    describe('Para el metodo deleteImagen', () => {
        test('Debe devolver true', async() => {
            //Arreglar
            const entidad = 'marca'
            const entidadId = 1
            const imagenId = 37
            await imagenRelacion.addImagen({entidad, entidadId, imagenId})

            //Actuar 
            const result = await imagenRelacion.deleteImagen({entidad, entidadId})
            
            //Asertar
            expect(result).toBe(true)
        })
    })
    describe('Para el metodo addImagen', () => {
        const agregado = {
            entidadId: null,
            entidad: 'marca'
        }
        afterAll(async () => {
            if(agregado.entidadId){
                await imagenRelacion.deleteImagen(agregado)
            }
        })
        test('al agregar una nueva relacion de imagen - marca debe devolver true', async () => {
            //Arreglar
            const entidadId = 3
            const entidad = 'marca'
            const imagenId = 38
            //Actuar
            const result = await imagenRelacion.addImagen({entidad, imagenId, entidadId })
            if(result){
                agregado.entidadId = entidadId
            }
            //Asertar
            expect(result).toBe(true)
        })
    })
})
