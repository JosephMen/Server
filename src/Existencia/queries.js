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
