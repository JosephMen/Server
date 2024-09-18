export const CONSULTA_VENTA = {
  OBTENER_TODOS: 'SELECT * FROM VENTA',
  OBTENER: 'SELECT * FROM VENTA WHERE ID=$1',
  AGREGAR: `INSERT INTO 
    VENTA(fechaRealizada, descripcion, clienteId, total, ganancia, esCredito, dependienteId, costo) 
    VALUES($1,$2,$3,$4,$5,$6,$7,$8) returning id`,
  ACTUALIZAR: '',
  ELIMINAR: 'DELETE FROM VENTA WHERE ID=$1'
}
