const CONSULTAS_USUARIO = {
  OBTENER_TODOS: 'SELECT * FROM usuarios LIMIT 10 OFFSET $1',
  OBTENER: 'SELECT * FROM usuarios WHERE usuarioId = $1',
  OBTENER_X_NOMBRE: 'SELECT * FROM usuarios WHERE nombre = $1',
  AGREGAR: 'INSERT INTO Usuarios(nombre) VALUES ($1) returning usuarioId',
  ELIMINAR: 'DELETE FROM Usuarios WHERE UsuarioId=$1',
  ACTUALIZAR: 'UPDATE Usuarios SET Nombre=$2,imagenUrl=$3 WHERE UsuarioId = $1'
}
export const CONSULTAS_PRODUCTOS = {
  OBTENER_TODOS: 'SELECT * FROM producto LIMIT 10 OFFSET $1',
  AGREGAR: 'INSERT INTO producto(nombre, codigo, descripcion) values($1, $2, $3) returning productoId',
  ACTUALIZAR: 'UPDATE producto SET nombre=$2,codigo=$3,descripcion=$4,imagenurl=$5 WHERE productoid=$1',
  OBTENER: 'SELECT * FROM producto WHERE productoid=$1',
  ELIMINAR: 'DELETE FROM producto WHERE productoid=$1',
  CHECK_EXISTENCIA: 'SELECT COUNT(1) FROM producto WHERE productoid=$1'
}

export const CONSULTAS_IMAGEN = {
  AGREGAR: 'INSERT INTO imagenes(imagen, usuarioId, productoId, nombre, mimetype) VALUES($1, $2, $3, $4, $5) returning imagenId',
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
export const CONSULTA_EXISTENCIA = {
  OBTENER: 'SELECT * FROM Existencia WHERE Id = $1',
  OBTENER_TODOS: 'SELECT * FROM Existencia',
  ELIMINAR: 'DELETE FROM Existencia WHERE Id = $1',
  ACTUALIZAR: `UPDATE Existencia 
  SET productoid=$2, stock=$3, precio=$4, costo=$5, fechaentrada=$6, fechamodificacion=$7
  WHERE id=$1`,
  AGREGAR: `INSERT INTO 
  Existencia(productoid, stock, precio, costo, fechaentrada, fechamodificacion) 
  VALUES ($1, $2, $3, $4, $5, $6) returning id`
}

export const CONSULTA_VENTA = {
  OBTENER_TODOS: 'SELECT * FROM VENTA',
  OBTENER: 'SELECT * FROM VENTA WHERE ID=$1',
  AGREGAR: `INSERT INTO 
  VENTA(fechaRealizada, descripcion, clienteId, total, ganancia, esCredito, dependienteId, costo) 
  VALUES($1,$2,$3,$4,$5,$6,$7,$8) returning id`,
  ACTUALIZAR: '',
  ELIMINAR: 'DELETE FROM VENTA WHERE ID=$1'
}

export default CONSULTAS_USUARIO
