const formatterSchema = (schema, object) => {
  const entradas = Object.entries(schema)
  entradas.forEach(([llave, _]) => {
    schema[llave] = object[llave.toLowerCase()]
  })
  return schema
}
export const mergerFactory = (schema) => {
  const mergeEntity = (input, entity) => {
    const entradas = Object.entries(input)
    entradas.forEach(([llave, valor]) => {
      entity[llave.toLowerCase()] = valor
    })
    return formatterSchema({ ...schema }, entity)
  }
  return mergeEntity
}

export default formatterSchema
