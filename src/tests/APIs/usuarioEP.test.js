import { createUserEP } from './usuarioEP'
import { Server } from 'http'
import { vi, describe, test, expect, beforeAll, afterAll } from 'vitest'
import UsuarioModel from '../../models/usuario'

const cliente = { query: vi.fn() }
const port = 3002
const usuarioModel = new UsuarioModel({ cliente })
const imagenService = {
  attachImageToUsuario: async () => 'user/imagen.jpg'
}

/**
 * @type {Server}
 */
let listenApp = null
const app = createUserEP({ usuarioModel, imagenService })
describe('Para probar el schema de usuarios desde el EndPoint', () => {
  beforeAll(() => {
    listenApp = app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}`)
    })
  })

  const usuarioFromDB = {
    id: 1,
    nombre: 'frander',
    imagenurl: 'usuarios/1',
    password: 'a;lkfjnvakomvoaj09fjrnlkjcnkjoia',
    permiso: 'administrador'
  }

  const usuarioEntity = {
    id: 1,
    nombre: 'frander',
    imagenUrl: 'usuarios/1',
    password: 'a;lkfjnvakomvoaj09fjrnlkjcnkjoia',
    permiso: 'administrador'
  }

  describe.skip('Para el metodo GET en "/usuarios"', () => {
    test('Debe devolver una lista vacia', async () => {
      // Arreglar
      const devolucion = { rowCount: 1, rows: [{ ...usuarioFromDB }] }
      cliente.query.mockResolvedValue(devolucion)

      // Actuar
      const result = await fetch(`http://localhost:${port}/usuarios`)
      const dataJSON = await result.json()

      // Asertar
      expect(result.ok).toBe(true)
      expect(dataJSON.data).toEqual([usuarioEntity])
    })
  })
  describe.skip('Para el metodo GET en "usuarios/:id"', () => {
    const devolucion = { rowCount: 1, rows: [{ ...usuarioFromDB }] }
    test('para el caso "usuarios/1" debe devolver un usuario', async () => {
      // Arreglar
      cliente.query.mockResolvedValue(devolucion)

      // Actuar
      const result = await fetch(`http://localhost:${port}/usuarios/1`)
      const dataJSON = await result.json()

      // Asertar
      expect(result.ok).toBe(true)
      expect(dataJSON.data).toEqual(usuarioEntity)
    })

    test('para el caso "usuarios/1" con el id no asociado a ningun usuario el status devuelto debe ser 400', async () => {
      // Arreglar
      const returnData = { ...devolucion }
      returnData.rowCount = 0
      cliente.query.mockResolvedValue(returnData)

      // Actuar
      const result = await fetch(`http://localhost:${port}/usuarios/1`)

      // Asertar
      expect(result.ok).toEqual(false)
    })
    test('para el caso "usuarios/ad" su estatus debe ser 404', async () => {
      // Arreglar

      // Actuar
      const result = await fetch(`http://localhost:${port}/usuarios/ad`)

      // Asertar
      expect(result.status).toBe(404)
    })
  })

  describe.skip('Para el metodo DELETE en "/usuarios:id"', () => {
    const devolucion = { rowCount: 1, rows: [{ ...usuarioFromDB }] }
    const method = 'DELETE'
    test('para el caso "usuarios/1" el estatus devuelto debe ser 200', async () => {
      // Arreglar
      const queryReturn = { ...devolucion }
      cliente.query.mockResolvedValue(queryReturn)

      // Actuar
      const result = await fetch(`http://localhost:${port}/usuarios/1`, { method })

      // Asertar
      expect(result.status).toBe(200)
    })
    test('para el caso "usuarios/1" y el usuario no existe el status devuelto debe ser 400', async () => {
      // Arreglar
      const queryReturn = { ...devolucion }
      queryReturn.rowCount = 0
      cliente.query.mockResolvedValue(queryReturn)

      // Actuar
      const result = await fetch(`http://localhost:${port}/usuarios/1`, { method })

      // Asertar
      expect(result.status).toBe(400)
    })
    test('para el caso "usuarios/ad" su estatus debe ser 404', async () => {
      // Arreglar

      // Actuar
      const result = await fetch(`http://localhost:${port}/usuarios/ad`, { method })

      // Asertar
      expect(result.status).toBe(404)
    })
  })
  describe('Para el metodo POST en "/usuarios"', () => {
    const user = {
      nombre: 'frander',
      password: '12346+7',
      permiso: 'administrador'
    }
    const headers = {
      'Content-Type': 'application/json'
    }
    const method = 'POST'

    test('para el caso de entradas correctas el estatus devuelto debe ser 200', async () => {
      // Arreglar
      const queryReturn = { rows: [{ id: 1 }] }
      const usuario = { ...user }
      const devolucion = { rowCount: 1, rows: [usuario] }
      cliente.query.mockResolvedValueOnce(queryReturn)
      cliente.query.mockResolvedValueOnce(devolucion)

      // Actuar
      const result = await fetch(`http://localhost:${port}/usuarios`, {
        method,
        headers,
        body: JSON.stringify(usuario)
      })
      const usuarioFetched = (await result.json()).data

      // Asertar
      expect(result.status).toBe(200)
      expect(usuarioFetched.nombre).toBe(user.nombre)
      expect(usuarioFetched.permiso).toBe(user.permiso)
    })

    test('para el caso de entradas incorrectas el estatus devuelto debe ser 400', async () => {
      // Arreglar
      const usuario = { ...user }
      usuario.permiso = 'err'

      // Actuar
      const result = await fetch(`http://localhost:${port}/usuarios`, {
        method,
        headers,
        body: JSON.stringify(usuario)
      })

      // Asertar
      expect(result.status).toBe(400)
    })
  })

  describe('Para el metodo PATCH en "/usuarios/:id"', () => {
    const userFromDB = {
      id: 1,
      nombre: 'frander',
      password: 'password',
      permiso: 'dependiente',
      imagenurl: 'imagen/user1.jpg'
    }
    const user = {
      nombre: 'frander',
      password: '12346+7',
      permiso: 'administrador'
    }
    const headers = {
      'Content-Type': 'application/json'
    }
    const method = 'PATCH'

    test('para el caso de entradas correctas el estatus devuelto debe ser 200', async () => {
      // Arreglar
      const usuario = { ...user }
      const queryReturn = { rowCount: 1 }
      cliente.query.mockResolvedValueOnce({ ...queryReturn, rows: [{ ...userFromDB }] })
      cliente.query.mockResolvedValueOnce({ ...queryReturn })
      cliente.query.mockResolvedValueOnce({ ...queryReturn, rows: [{ ...userFromDB }] })

      // Actuar
      const result = await fetch(`http://localhost:${port}/usuarios/1`, {
        method,
        headers,
        body: JSON.stringify(usuario)
      })

      // Asertar
      expect(result.status).toBe(200)
    })

    test('para el caso de entradas incorrectas el estatus devuelto debe ser 400', async () => {
      // Arreglar
      const usuario = { ...user }
      usuario.password = 'fadf'

      // Actuar
      const result = await fetch(`http://localhost:${port}/usuarios/1`, {
        method,
        headers,
        body: JSON.stringify(usuario)
      })

      // Asertar
      expect(result.status).toBe(400)
    })

    test('para el caso de param no correcto el error devuelto debe ser 404', async () => {
      // Arreglar
      const usuario = { ...user }

      // Actuar
      const result = await fetch(`http://localhost:${port}/usuarios/ad`, {
        method,
        headers,
        body: JSON.stringify(usuario)
      })

      // Asertar
      expect(result.status).toBe(404)
    })
  })

  afterAll(async () => {
    await new Promise((resolve) => {
      listenApp.close(() => {
        resolve()
      })
    })
  })
})
