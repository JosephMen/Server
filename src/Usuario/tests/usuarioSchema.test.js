import { describe, expect, test } from 'vitest'
import { validateUsuarioAuth, validateUsuarioEntity } from '../Schemas/usuarioSchema'
describe.skip('Para las funciones dentro de usuarioSchema.js', () => {
  describe('Para "validateUsuarioAuth"', () => {
    test('Debe devolver el mismo schema de objeto dado que es correcto', () => {
      // Arreglar
      const objeto = {
        nombre: 'frander',
        password: '123456'
      }

      // Actuar
      const result = validateUsuarioAuth(objeto)

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
      const funcion = () => validateUsuarioAuth(objeto)

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
      const funcion = () => validateUsuarioAuth(objeto)

      // Asertar
      expect(funcion).toThrow()
    })
    test('Debe arrojar un error pues el schema no es correcto', () => {
      // Arreglar
      const objeto = {
        password: '1236516'
      }

      // Actuar
      const funcion = () => validateUsuarioAuth(objeto)

      // Asertar
      expect(funcion).toThrow()
    })
    test('Debe arrojar un error pues el schema no es correcto', () => {
      // Arreglar
      const objeto = {
      }

      // Actuar
      const funcion = () => validateUsuarioAuth(objeto)

      // Asertar
      expect(funcion).toThrow()
    })
  })
  describe('Para "validateUsuarioEntity"', () => {
    const objetoCorrecto = {
      nombre: 'frander',
      password: '123456',
      permiso: 'Administrador'
    }
    test('Debe devolver el mismo schema de objeto dado que es correcto', () => {
      // Arreglar
      const objeto = { ...objetoCorrecto }

      // Actuar
      const result = validateUsuarioEntity(objeto)

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
      const funcion = () => validateUsuarioEntity(objeto)

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
      const funcion = () => validateUsuarioEntity(objeto)

      // Asertar
      expect(funcion).toThrow()
    })
  })
})
