/* eslint-disable */
import { vi, test, expect, describe } from 'vitest'
import ImagenController from '../../controllers/imagenController'
import res from '../Mocks/res.mock'
const mockGet = vi.fn()
mockGet.mockResolvedValueOnce([
  {
    mimetype: 1,
    imagen: 1
  }
])
.mockResolvedValueOnce([])
.mockRejectedValueOnce()
const mockImagenModel = {
  get: mockGet
}

describe.skip('Para el controlador Imagen', () => {
  const req = {
    params : {id : 1}
  }
  const imagenController = new ImagenController({imagenModel: mockImagenModel})
  test("Para el metodo getImagen correctamente", async () => {
    await imagenController.getImagen(req, res)
    expect(res.sendResult,"Resultado esperado del res.send()").toBe(1)
    expect(res.contentTypeResult,"Resultado esperado del res.contentType()").toBe(1)
  })
  test("Para el metodo getImagen sin registros", async () => {
    await imagenController.getImagen(req, res)
    expect(res.statusResult).toBe(400)
    expect(res.jsonResult).toEqual({ message: 'No hay registros' })
  })
  test("Para el metodo getImagen con errores", async () => {
    await imagenController.getImagen(req, res)
    expect(res.statusResult).toBe(500)
    expect(res.jsonResult).toEqual({ message: 'Algo ha salido mal' })
  })
})

