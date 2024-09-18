export default {
  OBTENER_TODOS: 'SELECT * FROM usuarios ORDER BY id LIMIT 10 OFFSET $1 ',
  OBTENER: 'SELECT * FROM usuarios WHERE id = $1',
  OBTENER_X_NOMBRE: 'SELECT * FROM usuarios WHERE nombre = $1',
  AGREGAR: 'INSERT INTO Usuarios(nombre) VALUES ($1) returning id',
  ELIMINAR: 'DELETE FROM Usuarios WHERE id=$1',
  ACTUALIZAR: 'UPDATE Usuarios SET Nombre=$2,imagenUrl=$3 WHERE id = $1'
}
