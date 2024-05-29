/* eslint-disable */
import res from '../Mocks/res.mock'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import UsuarioController from '../../controllers/usuarioController'
import { messageErrorCreator, messageSuccessCreator } from '../../utils/messageCreator'
const imagen = {
    name: "",
    mimetype: "",
    data: "",
}
const usuarioService = {
    add: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    getAll: vi.fn(),
    delete: vi.fn()
}
const next = () => 1
let resMock = res
let body = {}
let req = {}
const usuarioController = new UsuarioController({usuarioService})
describe.skip("Para UsuarioController", () => {
    beforeEach(() => {
        req = {body: {...body}}
        resMock = {...res}
    })
    test("Para el metodo getAll", async () => {
        usuarioService.getAll.mockResolvedValueOnce([])
        const mensajeEsperado = messageSuccessCreator({ data: [] })
        await usuarioController.getAll(req, resMock)
        expect(resMock.jsonResult).toEqual(mensajeEsperado)
    })
    test("Para el metodo get, vacio",async () => {
        usuarioService.getById.mockResolvedValueOnce(null)
        req.params = {id:1}
        await expect(usuarioController.get(req, resMock, next)).resolves.toEqual(1)
    })
    test("Para el metodo get, con un registro",async () => {
        usuarioService.getById.mockResolvedValueOnce(1)
        const mensajeEsperado = messageSuccessCreator({ data: 1 })
        req.params = {id:1}
        await usuarioController.get(req, resMock)
        expect(resMock.jsonResult).toEqual(mensajeEsperado)
    })
    test("Para el metodo add", async() => {
        req.body.nombre = ''
        req.files = {imagen}
        const usuarioEsperado = {
            id: '',
            nombre: '',
            imagenUrl: ''
        }
        usuarioService.add.mockResolvedValueOnce({
            id: '',
            nombre: '',
            imagenUrl: ''
        })
        const mensajeEsperado = messageSuccessCreator({
            mensaje: 'Usuario creado',
            data: usuarioEsperado
        })
        await usuarioController.add(req, resMock)
        expect(resMock.jsonResult).toEqual(mensajeEsperado)
    })
    test("Para add con parametros erroneos", async () => {
        await expect(usuarioController.add(req, resMock)).rejects.toThrow()
    })
    test("Para delete", async () => {
        req.params = {id:1}
        usuarioService.delete.mockResolvedValueOnce(true)
        const messageEsperado = messageSuccessCreator({ mensaje: 'Usuario eliminado exitosamente' })
        await usuarioController.delete(req, resMock)
        expect(resMock.jsonResult).toEqual(messageEsperado)
    })
    test("Para delete con usuario no existe", async () => {
        const next = () => 1
        req.params = {id:1}
        usuarioService.delete.mockRejectedValueOnce(false)
        await expect(usuarioController.delete(req, resMock, next)).resolves.toEqual(1)
    })
    test("Para el metodo updateUsuario", async() => {
        req.body.nombre = ''
        req.params = {id:1}
        req.files = {imagen}
        usuarioService.update.mockResolvedValueOnce({
            id: '',
            nombre: '',
            imagenUrl: ''
        })
        const usuarioEsperado = {
            id: '',
            nombre: '',
            imagenUrl: ''
        }
        const mensajeEsperado = messageSuccessCreator({
            mensaje: 'Usuario actualizado',
            data: usuarioEsperado
        })
        await usuarioController.update(req, resMock)
        expect(resMock.jsonResult).toEqual(mensajeEsperado)
    })
    test("Para el metodo updateUsuario sin registro previo", async() => {
        req.body.nombre = ''
        req.params = {id:1}
        usuarioService.update.mockRejectedValueOnce()
        await expect(usuarioController.update(req, resMock, next)).resolves.toBe(1)
    })
})

