export const CONSULTAS_IMAGEN = {
  AGREGAR: 'INSERT INTO imagenes(imagen, usuarioId, productoId, nombre, mimetype) VALUES($1, $2, $3, $4, $5) returning id',
  OBTENER_POR_USUARIO: 'SELECT imagen, mimetype FROM imagenes WHERE usuarioId = $1',
  OBTENER_ID_X_USUARIO: 'SELECT imagenid FROM imagenes WHERE usuarioid=$1',
  OBTENER_ID_X_PRODUCTO: 'SELECT imagenid FROM imagenes WHERE productoid=$1',
  OBTENER: 'SELECT imagen, mimetype FROM imagenes WHERE imagenid = $1',
  ELIMINAR: 'DELETE FROM imagen WHERE usuarioId = $1 or productoId = $2',
  ACTUALIZAR: 'UPDATE imagenes SET imagen=$2, nombre=$3, mimetype=$4 WHERE imagenid=$1',
  ACTUALIZAR_X_PRODUCTO: 'UPDATE imagenes SET imagen=$2, nombre=$3, mimetype=$4 WHERE productoid=$1',
  ACTUALIZAR_X_USUARIO: 'UPDATE imagenes SET imagen=$2, nombre=$3, mimetype=$4 WHERE usuarioid=$1',
  CONTAR_X_PRODUCTO: 'SELECT count(imagenid) FROM imagenes WHERE productoid = $1',
  CONTAR_X_USUARIO: 'SELECT count(imagenid) FROM imagenes WHERE usuarioid = $1'
}
