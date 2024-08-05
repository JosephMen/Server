const method = 'POST'
const port = 3003
const headers = {
  'Content-Type': 'application/json'
}
const usuario = {
  nombre: 'frander',
  password: '12356+8',
  permiso: 'administrador'
}
const result = await fetch(`http://localhost:${port}/usuarios`, {
  method,
  headers,
  body: JSON.stringify(usuario)
})
const usuarioFetched = await result.json()
console.log('usuarios devuelto en post: ', usuarioFetched)
