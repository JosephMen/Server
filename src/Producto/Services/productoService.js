import ProductoModel from '../Model/producto.js'
import ImagenService from '../../Imagen/Services/imagenService.js'
import { mapEntityToProducto } from '../utils/mapper.js'
import IGenericEntity from '../../Common/interfaces/models/IGenericEntity.js'
import Categoria from '../Model/categoria.js'
import Marca from '../Model/marca.js'
import Proveedor from '../Model/proveedor.js'
import { BadArgumentsError } from '../../Common/errors/errorClasses.js'
/**
 * @typedef Producto
 * @property {Number} id
 * @property {String} imagenUrl
 * @property {String} codigo
 * @property {String} nombre
 * @property {Number} categoriaId
 * @property {String} descripcion
 */

export default class ProductoService {
  /**
   * @type {object}
   */
  #entidades
  /**
   * @type {ImagenService}
   */
  #imagenService
  /**
   * @type {ProductoModel}
   */
  #productoModel
  /**
   *
   * @param {{
   * imagenService: ImagenService,
   * productoModel: ProductoModel,
   * categoriaModel: Categoria,
   * marcaModel: Marca,
   * proveedorModel: Proveedor
   * }} param0
   */
  constructor ({ imagenService, productoModel, categoriaModel, marcaModel, proveedorModel }) {
    this.#imagenService = imagenService
    this.#productoModel = productoModel
    this.#entidades = {
      categoria: {
        modelo: categoriaModel
      },
      proveedor: {
        modelo: proveedorModel
      },
      marca: {
        modelo: marcaModel
      }
    }
  }

  /**
   *
   * @param {{offset: Number}} param0
   * @returns {Promise<Array<Producto>>}
   */
  getAll = async ({ offset } = { offset: 0 }) => {
    return await this.#productoModel.getAll({ offset })
  }

  get = async (productoId) => {
    const producto = await this.#productoModel.getById(productoId)
    if (producto === null) throw new BadArgumentsError('Producto no encontrado')
    return producto
  }

  update = async (producto, imagen) => {
    const productoBD = mapEntityToProducto(await this.#productoModel.getById(producto.id))
    if (productoBD === null) throw new BadArgumentsError('Producto no encontrado')
    if (imagen) producto.imagenUrl = await this.#imagenService.attachImageToProducto(imagen, producto.id)
    await this.#productoModel.update({ ...productoBD, ...producto })
    return await this.#productoModel.getById(producto.id)
  }

  delete = async (productoId) => {
    const producto = await this.#productoModel.getById(productoId)
    if (producto === null) throw BadArgumentsError('Producto no encontrado')
    await this.#productoModel.delete(productoId)
  }

  add = async (producto, imagen) => {
    producto.id = await this.#productoModel.add(producto)
    if (imagen) {
      producto.imagenUrl = await this.#imagenService.attachImageToProducto(imagen, producto.id)
      await this.#productoModel.update(producto)
    }
    return await this.#productoModel.getById(producto.id)
  }

  /**
   *
   * @param {String} entidad La entidad asociada al model
   * @returns {IGenericEntity}
   */
  #getModelo = (entidad) => {
    if (!this.#entidades[entidad]) throw BadArgumentsError('No existe la entidad: ' + entidad)
    return this.#entidades[entidad].modelo
  }

  getAllResto = async (entidad) => {
    const modelo = this.#getModelo(entidad)
    return modelo.getAll()
  }

  /**
   * @description retorna los datos asociados a la entidad
   * @param {Object} param0
   * @param {string} param0.entidad 'la entidad a consultar'
   * @param {number} param0.id 'el id de la entidad'
   * @returns {Promise<string>}
   */
  getResto = async ({ entidad, id }) => {
    const modelo = this.#getModelo(entidad)
    const entity = await modelo.get(id)
    entity.imagenurl = await this.#imagenService.getResto(entidad, id)
    return entity
  }

  /**
   *
   * @param {object} param0
   * @param {string} param0.entidad Entidad asociada
   * @param {string} param0.nombre El nombre de la nueva entidad
   * @param {Buffer | null} param0.imagen La imagen a agregar
   */
  addResto = async ({ entidad, data, imagen = null }) => {
    const modelo = this.#getModelo(entidad)
    data.id = await modelo.add(data)
    if (imagen) {
      data.imagenurl = await this.#imagenService.addResto(entidad, data.id, imagen)
      await modelo.update(data)
    }
    return data
  }

  updateResto = async (entidad, objeto, imagen) => {
    const { id } = objeto
    const modelo = this.#getModelo(entidad)
    const infoActual = await modelo.get(id)
    const infoNueva = { ...infoActual, ...objeto }
    if (imagen) {
      infoNueva.imagenurl = await this.#imagenService.addResto(entidad, id, imagen)
    }
    const actualizado = await modelo.update(infoNueva)
    if (actualizado) return infoNueva
    return null
  }

  deleteResto = async (entidad, id) => {
    const modelo = this.#getModelo(entidad)
    return modelo.delete(id)
  }
}
