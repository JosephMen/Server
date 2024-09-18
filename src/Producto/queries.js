export const CONSULTAS_PRODUCTOS = {
  OBTENER_TODOS: 'SELECT * FROM producto LIMIT 10 OFFSET $1',
  AGREGAR: 'INSERT INTO producto(nombre, codigo, descripcion) values($1, $2, $3) returning productoId',
  ACTUALIZAR: 'UPDATE producto SET nombre=$2,codigo=$3,descripcion=$4,imagenurl=$5 WHERE productoid=$1',
  OBTENER: 'SELECT * FROM producto WHERE productoid=$1',
  ELIMINAR: 'DELETE FROM producto WHERE productoid=$1',
  CHECK_EXISTENCIA: 'SELECT COUNT(1) FROM producto WHERE productoid=$1'
}
export const CONSULTAS_ETIQUETA = {
  AGREGAR: 'INSERT INTO ETIQUETA(nombre) VALUES($1) returning id',
  ELIMINAR: 'DELETE FROM ETIQUETA WHERE ID = $1',
  ACTUALIZAR: 'UPDATE Etiqueta SET nombre=$2 WHERE id=$1',
  OBTENER: 'SELECT * FROM Etiqueta WHERE id=$1',
  OBTENER_TODOS_CON_RANGOS: 'SELECT * FROM Etiqueta LIMIT 20 OFFSET $1',
  OBTENER_TODOS: 'SELECT * FROM Etiqueta',
  ATTACH_X_PRODUCTO: 'INSERT INTO ProductoXEtiqueta(etiquetaid, productoid) VALUES ($1,$2)',
  DELETE_OF_PRODUCTO: 'DELETE FROM ProductoXEtiqueta WHERE productoid=$1 AND etiquetaid=$2',
  CONTAR: 'SELECT COUNT(*) AS cantidad FROM etiqueta WHERE nombre = $1'
}
