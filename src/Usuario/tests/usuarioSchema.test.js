import { describe, expect, test } from 'vitest'
import { validateUsuarioToStore } from '../Schemas/usuarioToStoreSchema'
import { validateUsuarioToAuth } from '../Schemas/usuarioToAuthSchema'
describe('Para las funciones dentro de usuarioSchema.js', () => {
  describe('Para "validateUsuarioToAuth"', () => {
    test('Debe devolver el mismo schema de objeto dado que es correcto', () => {
      // Arreglar
      const objeto = {
        username: 'frander',
        password: '123456'
      }

      // Actuar
      const result = validateUsuarioToAuth(objeto)

      // Asertar
      expect(result).toEqual(objeto)
    })

    test('Debe arrojar un error pues el schema no es correcto', () => {
      // Arreglar
      const objeto = {
        nombre: 'frander',
        password: '123'
      }

      // Actuar
      const funcion = () => validateUsuarioToAuth(objeto)

      // Asertar
      expect(funcion).toThrow()
    })

    test('Debe arrojar un error pues el schema no es correcto', () => {
      // Arreglar
      const objeto = {
        nombre: 'fra',
        password: '1236516'
      }

      // Actuar
      const funcion = () => validateUsuarioToAuth(objeto)

      // Asertar
      expect(funcion).toThrow()
    })
    test('Debe arrojar un error pues el schema no es correcto', () => {
      // Arreglar
      const objeto = {
        password: '1236516'
      }

      // Actuar
      const funcion = () => validateUsuarioToAuth(objeto)

      // Asertar
      expect(funcion).toThrow()
    })
    test('Debe arrojar un error pues el schema no es correcto', () => {
      // Arreglar
      const objeto = {
      }

      // Actuar
      const funcion = () => validateUsuarioToAuth(objeto)

      // Asertar
      expect(funcion).toThrow()
    })
  })
  describe('Para "validateUsuarioToStore"', () => {
    const objetoCorrecto = {
      nombre: 'frander',
      username: 'frander',
      password: '123456',
      permiso: 'administrador'
    }
    test('Debe devolver el mismo schema de objeto dado que es correcto', () => {
      // Arreglar
      const objeto = { ...objetoCorrecto }

      // Actuar
      const result = validateUsuarioToStore(objeto)

      // Asertar
      expect(result).toEqual(objetoCorrecto)
    })

    test('Debe arrojar un error pues el schema no es correcto', () => {
      // Arreglar
      const objeto = {
        nombre: 'frander',
        password: '123'
      }

      // Actuar
      const funcion = () => validateUsuarioToStore(objeto)

      // Asertar
      expect(funcion).toThrow()
    })

    test('Debe arrojar un error pues el schema no es correcto', () => {
      // Arreglar
      const objeto = {
        nombre: 'fra',
        password: '1236516'
      }

      // Actuar
      const funcion = () => validateUsuarioToStore(objeto)

      // Asertar
      expect(funcion).toThrow()
    })
  })
})
