/* eslint-disable */

const a = {
    a: 1,
    b: 2
}
function funcion1() {
    console.log(this.a + this.b)
}
a.funcion = funcion1

a.funcion()
const b = {
    a: 3,
    b: 3
}
b.funcion = a.funcion

b.funcion()