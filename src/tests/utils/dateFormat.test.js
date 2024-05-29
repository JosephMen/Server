import { describe, expect, test, vi } from 'vitest'
import dateFormat from '../../utils/dateFormat'

describe.skip('Test para dateFormat', () => {
  test('Debe devolver un error', () => {
    // Arreglar
    const entrada = '01/30/2024'
    // Actuar
    const result = () => dateFormat(entrada)
    // Asertar
    expect(result).toThrow()
  })

  test('Para la entrada 01/30/2024 su salida debe ser 30/1/2024', () => {
    // Arreglar
    const entrada = '2024-01-30'
    // Actuar
    const result = dateFormat(entrada)
    // Asertar
    expect(result).toBe('30/1/2024')
  })
})
