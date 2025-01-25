import dotenv from 'dotenv'
import pkg from 'pg'

const { Pool } = pkg
dotenv.config()

const { USER, PASSWORD, DATABASE, HOST, PORT } = process.env

const Cliente = new Pool({
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  host: HOST,
  port: PORT
})

/**
 *
 * @param {typeof Cliente | import('pg').PoolClient} cliente
 * @returns
 */
const wrapCliente = (cliente) => {
  return {
    query: function (query, args) {
      this.logger('\nquery: ', query)
      this.logger('argumentos: ', args ?? 'No hay argumentos')
      return cliente.query(query, args)
    },
    async connect () {
      this.logger('\nSe ha inicializado un cliente para transacción')
      return wrapCliente(await cliente.connect())
    },
    release () {
      this.logger('\nSe ha liberado el cliente de la transacción\n')
      cliente.release()
    },
    logger: console.log
  }
}
export const clientWrapped = wrapCliente(Cliente)

export default Cliente
