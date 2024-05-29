export class Usuario {
  constructor (usuarioModelo) {
    this.nombre = usuarioModelo.nombre
    this.imagenUrl = usuarioModelo.imagenurl
  }
}
export class Producto {
  constructor (productoModelo) {
    this.id = productoModelo.productoid
    this.nombre = productoModelo.nombre
    this.codigo = productoModelo.codigo
    this.descripcion = productoModelo.descripcion
    this.categoriaId = productoModelo.categoriaid
    this.imagenUrl = productoModelo.imagenurl
  }
}
