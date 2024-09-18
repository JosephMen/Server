export const CONSULTAS_GENERIC = {
  GET_ALL: NOMBRE => `SELECT * FROM ${NOMBRE}`,
  ADD: (TABLA, VALUES) => {
    const enumerados = VALUES.map((_, index) => `$${index + 1}`).join(', ')
    const estructura = ['INSERT INTO', TABLA, '(', VALUES.join(','), ')', 'VALUES', '( ', enumerados, ' )', 'returning id']
    return estructura.join(' ')
  },
  UPDATE: (TABLA, VALUES) => {
    const enumerados = VALUES.map((VAL, index) => `${VAL}=$${index + 2}`)
    const estructura = ['UPDATE', TABLA, 'SET', enumerados.join(', '), 'WHERE ID = $1']
    return estructura.join(' ')
  },
  GET: TABLA => `SELECT * FROM ${TABLA} WHERE ID = $1`,
  DELETE: TABLA => `DELETE FROM ${TABLA} WHERE ID = $1`
}
