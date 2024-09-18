import { vi, describe, test, expect } from 'vitest'
import { validateNumericId } from '../Middlewares/commonValidate'
describe.skip('Para las validaciones del modulo "commonValidate"', () => {
  const reqMock = {
    body: {},
    params: {}
  }
  const resMock = {
    send: vi.fn()
  }
  const nextMock = () => 1
  describe('Para la validacion "validateNumericId"', () => {
    test('el body del request debe tener skip en false y el id en 1', async () => {
      // Arreglar
      const req = { ...reqMock, params: { id: 1 } }
      const res = { ...resMock }
      const next = nextMock

      // Actuar
      await validateNumericId(req, res, next)

      // Asertar
      expect(req.body.skip).toBe(false)
      expect(req.body.id).toBe(1)
    })
    test('el body del request debe tener skip en true y el id es NaN', async () => {
      // Arreglar
      const req = { ...reqMock, params: { id: 'hola' } }
      const res = { ...resMock }
      const next = nextMock

      // Actuar
      await validateNumericId(req, res, next)

      // Asertar
      expect(req.body.skip).toBe(true)
      expect(req.body.id).toBeNaN()
    })
  })
})
