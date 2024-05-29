/**
 *
 * @param {Object} param0
 * @param {String} param0.table tabla donde se hará el insert
 * @param {Object} param0.data objeto que contiene los campos que se mapean a la tabla
 */
const createInsertQuery = ({ table, data }) => {
  if (typeof table !== 'string') throw new Error('El parametro tabla debe ser una cadena')
  if (typeof data !== 'object') throw new Error('El parametro params debe un objeto con campos')
  const values = []
  const keys = []
  const indexes = []
  Object.entries(data).forEach(([key, value], index) => {
    values.push(value)
    keys.push(key)
    indexes.push(`$${index + 1}`)
  })
  if (values.length === 0) return [null, null]
  const query = `INSERT INTO ${table}(${keys.join(',')}) VALUES (${indexes.join(',')}) RETURNING id`
  return [query, values]
}
/**
 *
 * @param {Object} param0
 * @param {String} param0.table Tabla donde se hará la actualización de datos
 * @param {Object} param0.data Objeto que contiene los campos mapeados de la tabla
 * @param {Number} param0.id id del registro especifico
 * @returns
 */
const createUpdateQuery = ({ table, data, id }) => {
  const values = []
  delete data.id
  if (typeof id !== 'number') throw new Error('El id debe ser un numero')
  if (typeof table !== 'string') throw new Error('El parametro tabla debe ser una cadena')
  if (typeof data !== 'object') throw new Error('El parametro params debe un objeto con campos')

  const sets = Object.entries(data).map(([key, value], index) => {
    values.push(value)
    return `${key}=$${index + 2}`
  }).join(', ')
  if (values.length === 0) return [null, null]
  values.unshift(id)
  const query = `UPDATE  ${table} SET ${sets}  WHERE id=$1`
  return [query, values]
}

const queryBuilder = {
  createInsertQuery,
  createUpdateQuery
}
export default queryBuilder
