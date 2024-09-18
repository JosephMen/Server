import { BadArgumentsError, ConnectionError, RelationalDataError } from '../../Common/errors/errorClasses.js'

export default class ImagenRelacion {
  #Cliente
  #entidades

  /**
   *
   * @param {object} param0
   * @param {import('pg').PoolClient} param0.cliente
   */
  constructor ({ cliente }) {
    this.#Cliente = cliente
    this.#entidades = {
      categoria: 'categoriaid',
      marca: 'marcaid',
      proveedor: 'proveedorid'
    }
  }

  /**
   *
   * @param {{entidad: String, entidadId: Number}} param0
   */
  deleteImagen = async ({ entidad, entidadId }) => {
    const tipoId = typeof entidadId
    const propiedad = this.#entidades[entidad]
    if (tipoId !== 'number') throw new BadArgumentsError('Error al eliminar imagenRelacion: entidadId no es entero -> ' + tipoId)
    if (!propiedad) throw new BadArgumentsError('Error al eliminar imagenRelacion: propiedad no encontrada ' + entidad)
    try {
      const consulta = `DELETE FROM IMAGEN_RELACIONES WHERE ${propiedad} = $1`
      const result = await this.#Cliente.query(consulta, [entidadId])
      return result.rowCount > 0
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(e, 'Error al eliminar imagen')
      throw new RelationalDataError(e, 'Error al eliminar imagen')
    }
  }

  /**
   *
   * @param {{ entidad: String, imagenId: number, entidadId: number}} param0
   * @returns {Promise<Boolean>}
   */
  addImagen = async ({ entidad, imagenId, entidadId }) => {
    const tipoId = typeof entidadId
    const tipoImagenId = typeof imagenId
    const propiedad = this.#entidades[entidad]
    if (tipoId !== 'number') throw new BadArgumentsError(`Error al agregagar imagen: tipo entidadId no es entero, encontrado ${tipoId}`)
    if (tipoImagenId !== 'number') throw new BadArgumentsError(`Error al agregagar imagen: tipo imagenId no es entero, encontrado ${tipoImagenId}`)
    if (!propiedad) throw new BadArgumentsError('Propiedad no encontrada, ' + entidad)

    try {
      const consulta = `INSERT INTO IMAGEN_RELACIONES(IMAGENID, ${propiedad}) VALUES ($1, $2)`
      const result = await this.#Cliente.query(consulta, [imagenId, entidadId])
      return result.rowCount > 0
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(e, 'Error al agregar imagen')
      throw new RelationalDataError(e, 'Error al agregar agregar imagen')
    }
  }

  /**
   *
   * @param {{entidad: String, id: Number}} param0
   * @returns {Promise<Number>}
   */
  getImagenId = async ({ entidad, id }) => {
    try {
      const propiedad = this.#entidades[entidad]
      const tipoId = typeof id
      if (!propiedad) throw new BadArgumentsError('No existe la entidad ' + entidad)
      if (tipoId !== 'number') throw new BadArgumentsError('el tipo de id debe ser entero, encontrado: ' + tipoId)
      const consulta = `SELECT imagenid as id from IMAGEN_RELACIONES WHERE ${propiedad} = $1`
      const result = await this.#Cliente.query(consulta, [id])
      if (result.rowCount === 0) return -1
      return result.rows[0].id
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(e, 'Error al traer imagenid en Imagen_relacion')
      if (e instanceof BadArgumentsError) throw e
      throw new RelationalDataError(e, 'Error de relacion al obtener imagenid')
    }
  }

  /**
   *
   * @param {{entidad: String, id: Number}} param0
   * @returns {Promise<Number>}
   */
  countImagenes = async ({ entidad, id }) => {
    const propiedad = this.#entidades[entidad]
    const tipoId = typeof id
    if (!propiedad) throw new BadArgumentsError('No existe la entidad: ' + entidad)
    if (tipoId !== 'number') throw new BadArgumentsError('El id debe ser entero, encontrado: ' + tipoId)
    try {
      const consulta = `SELECT COUNT(*) as cantidad from IMAGEN_RELACIONES WHERE ${propiedad} = $1`
      const result = await this.#Cliente.query(consulta, [id])
      return Number.parseInt(result.rows[0].cantidad)
    } catch (e) {
      if (e instanceof AggregateError) throw new ConnectionError(e, 'Error de conexion al consultar Imagen_relacion')
      throw new RelationalDataError(e, 'Error de relacion al obtener imagenid')
    }
  }
}
