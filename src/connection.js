import dotenv from 'dotenv'
import pkg from 'pg'
const { Pool } = pkg
dotenv.config()

const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const DATABASE = process.env.DATABASE
const HOST = process.env.HOST
const PORT = process.env.PORT

const Cliente = new Pool({
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  host: HOST,
  port: PORT
})
export default Cliente
