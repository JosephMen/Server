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

export const loggedQuery = (query, values) => {
  console.log('Query: ', query)
  console.log('Values: ', values)
  return Cliente.query(query, values)
}
export const getClient = () => {
  return Cliente.connect()
}
export default Cliente
