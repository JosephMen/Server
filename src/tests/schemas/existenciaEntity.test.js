import { describe, expect, test } from 'vitest'
import existencia from '../../schema/existenciaEntity'
import dateFormat, { esBisiesto } from '../../utils/dateFormat'

describe.skip('Para el schema de existenciaEntity', () => {
  test('debe devolver verdadero y el schema con todos sus datos', () => {
    // Arreglar
    const objeto = {
      productoid: 1,
      stock: 1,
      precio: 1,
      costo: 1
    }
    // Actuar
    const resultado = existencia.safeParse(objeto)
    // Asertar
    console.log(resultado.data)
    expect(resultado.success).toBe(true)
    if (resultado.success) {
      expect(resultado.data.fechaentrada).toBe('18/4/2024')
    }
  })
})

describe.skip('Para el modulo de fechas, dateFormat() y esBisiesto()', () => {
  describe('Para el modulo esBisiesto(): ', () => {
    test('Debe retornar falso para el año 2001', () => {
      const result = esBisiesto(2001)

      expect(result).toBe(false)
    })
    test('Debe retornar verdadero para el año 2024', () => {
      const result = esBisiesto(2024)

      expect(result).toBe(true)
    })
    test('Debe retornar falso para el año 2100', () => {
      const result = esBisiesto(2100)

      expect(result).toBe(false)
    })
    test('Debe retornar verdadero para el año 2000', () => {
      const result = esBisiesto(2000)

      expect(result).toBe(true)
    })
    test('Debe retornar falso para el año 1900', () => {
      const result = esBisiesto(1900)

      expect(result).toBe(false)
    })
  })
  describe('Para el modulo dateFormat()', () => {
    test('Debe devolver: "1/2/2010"', () => {
      const result = dateFormat('1-2-2010')
      expect(result).toBe('1/2/2010')
    })

    test('Debe devolver: "1/2/2010"', () => {
      const result = dateFormat('2010-2-1')
      expect(result).toBe('1/2/2010')
    })

    test('Debe arrojar un error', () => {
      expect(() => dateFormat('1899-1-1')).toThrow()
    })

    test('Debe arrojar un error por no ser bisiesto', () => {
      expect(() => dateFormat('1899-2-29')).toThrow()
    })
    test('Debe arrojar un error porque el mes no es aceptado', () => {
      expect(() => dateFormat('1899-13-29')).toThrow()
    })
    test('Debe arrojar un error porque el dia no es aceptado', () => {
      expect(() => dateFormat('1899-1-32')).toThrow()
    })
    test('Debe arrojar un error porque la entrada no es un string', () => {
      expect(() => dateFormat(1)).toThrow()
    })
    test('Debe arrojar un error porque la entrada string no es valida', () => {
      expect(() => dateFormat('1-1-2010-1')).toThrow()
    })
  })
})
