import { createUserEP } from './usuarioEP.js'
const port = 3003
const usuarioModel = {
  async getAll () {
    return []
  },
  async add (usuario) {
    this.storedUser = usuario
    return 1
  },
  async updatefunction () {
    return this.storedUser
  },
  async getById () {
    return this.storedUser
  },
  async getByName () {
    return this.storedUser
  },
  storedUser: null
}

const imagenService = {
  attachImageToUsuario: async () => 'user/imagen.jpg'
}
const app = createUserEP({ usuarioModel, imagenService })

app.listen(port, () => {
  console.log(`listening in port http://localhost:${port}`)
})
