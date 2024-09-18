/* eslint-disable */
import {vi, describe, test, expect, beforeEach} from 'vitest'
import ProductoController from "../Controller/productoController";
import {messageSuccessCreator} from '../../Common/utils/messageCreator'
import res  from "../../Common/Mocks/res.mock";

const body = {
    nombre: "frander",
    codigo: "mena",
    descripcion: "ninguna",
}
const req = {
    body
}
const productoService = {
    getAll : vi.fn(),
    get: vi.fn(),
    add: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
}
const etiquetaService = {
    
}
const productoController = new ProductoController({productoService, etiquetaService})
const schemaEsperado = {
    id: 1,
    imagenUrl: null,
    codigo: 1,
    nombre: 'frander',
    categoriaId: 1,
    descripcion: 'ninguna'
}
const imagen = {
    name: "",
    mimetype: "",
    data: "",
}
const next = () => 1

describe.skip("Para el metodo add", () => {
    
    test("con entradas validas", async () => {
        productoService.add.mockResolvedValueOnce({
            id: 1,
            imagenUrl: null,
            codigo: 1,
            nombre: 'frander',
            categoriaId: 1,
            descripcion: 'ninguna'
        })
        await productoController.add(req, res)
        const esperadoRes = {
            mensaje: 'Producto Creado',
            descripcion: '',
            data: schemaEsperado
        }
        expect(res.jsonResult).toEqual(esperadoRes)
    })
    test("con una peticion vacia", async ( ) => {
        req.body = {}
        await expect(productoController.add(req, res, next)).resolves.toBe(1)
    })
    test("con entradas e imagen", async () => {
        productoService.add.mockResolvedValueOnce({
            id: 1,
            imagenUrl: "imagen/1",
            codigo: 1,
            nombre: 'frander',
            categoriaId: 1,
            descripcion: 'ninguna'
        })
        schemaEsperado.imagenUrl = "imagen/1"
        const resultadoEsperado = messageSuccessCreator({ 
            mensaje: 'Producto Creado', 
            data: schemaEsperado
        })
        req.body = body
        req.body.files = {imagen}
        await productoController.add(req, res)
        expect(res.jsonResult).toEqual(resultadoEsperado)
    })
})
describe.skip("Para el metodo update", () => {
    let reqNuevo = {
        ...body,
    }
    let resNuevo = {
        ...res
    }
    beforeEach(() => {
        reqNuevo = {
            body: {...body},
        }
        resNuevo = {
            ...res
        }
    })
    test("Con entradas validas", async () => {
        reqNuevo.params = {id:1}
        reqNuevo.files = {imagen}
        productoService.update.mockResolvedValueOnce({
            id: 1,
            imagenUrl: "imagen/1",
            codigo: 1,
            nombre: 'frander',
            categoriaId: 1,
            descripcion: 'ninguna'
        })
        const data = schemaEsperado
        const resultadoEsperado = messageSuccessCreator({
                mensaje: 'Producto actualizado',
                data
        })
        await productoController.update(reqNuevo, resNuevo)
        expect(resNuevo.jsonResult).toEqual(resultadoEsperado)
    })
    test("Con entradas invalidas", async () => {
        reqNuevo.body = {id: "invalid"}
        await expect(productoController.update(reqNuevo, resNuevo, next)).resolves.toBe(1)
    })
    test("Cou un registro que no existe", async () => {
        productoService.update.mockRejectedValueOnce()
        reqNuevo.params = {id:1}
        await expect(productoController.update(reqNuevo, resNuevo, next)).resolves.toBe(1)
    })
})
describe.skip("Para el metodo get", () => {
    let reqNuevo = {
        ...body,
    }
    let resNuevo = {
        ...res
    }
    beforeEach(() => {
        reqNuevo = {
            body: {...body},
        }
        resNuevo = {
            ...res
        }
    })
    test("Con entradas correctas", async () => {
        productoService.get.mockResolvedValueOnce(1)
        reqNuevo.params = {id:1}
        const messageEsperado = messageSuccessCreator({data:1})
        await productoController.get(reqNuevo, resNuevo)
        expect(resNuevo.jsonResult).toEqual(messageEsperado)
    })
    test("Con un registro que no existe", async () => {
        productoService.get.mockRejectedValueOnce()
        reqNuevo.params = {id:1}
        await expect(productoController.get(reqNuevo, resNuevo, next)).resolves.toBe(1)
    })

})
describe.skip("Para el metodo delete", () => {
    let reqNuevo = {
        ...body,
    }
    let resNuevo = {
        ...res
    }
    beforeEach(() => {
        reqNuevo = {
            body: {...body},
        }
        resNuevo = {
            ...res
        }
    })
    test("Para una entrada correcta", async() => {
        reqNuevo.params = {id:1}
        productoService.delete.mockResolvedValueOnce()
        const messageEsperado = messageSuccessCreator({ mensaje: 'Producto eliminado' })
        await productoController.delete(reqNuevo, resNuevo)
        expect(resNuevo.jsonResult).toEqual(messageEsperado)
    })
    test("Para un registro que no existe", async() => {
        reqNuevo.params = {id:1}
        productoService.delete.mockRejectedValueOnce()
        await expect(productoController.delete(reqNuevo, resNuevo, next)).resolves.toBe(1)
    })

})
describe.skip("Para el metodo getAll", () => {
    let reqNuevo = {
        ...body,
    }
    let resNuevo = {
        ...res
    }
    beforeEach(() => {
        reqNuevo = {
            body: {...body},
        }
        resNuevo = {
            ...res
        }
    })
    test("Con entradas correctas", async () => {
        productoService.getAll.mockResolvedValueOnce([])
        const messageEsperado = messageSuccessCreator({ data: [] })

        await productoController.getAll(reqNuevo, resNuevo)
        expect(resNuevo.jsonResult).toEqual(messageEsperado)
    })
    test("Con error en el cliente", async () => {
        productoService.getAll.mockRejectedValueOnce()
        await expect(productoController.getAll(reqNuevo, resNuevo, next)).resolves.toBe(1)
    })
})