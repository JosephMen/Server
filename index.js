import dotenv from 'dotenv'
import createApp from './src/apps/app-local.js'
import Cliente from './src/connection.js'
const app = createApp(Cliente)
dotenv.config()
const PUERTO_EXPUESTO = process.env.PUERTO_EXPUESTO ?? 1234
app.listen(PUERTO_EXPUESTO, () => {
  console.log(`Aplicación expuesta en http://localhost:${PUERTO_EXPUESTO}`)
})
