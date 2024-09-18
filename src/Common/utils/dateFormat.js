export default function dateFormat (date, separador = '/') {
  if (typeof date !== 'string') throw new Error('El parametro de entrada debe ser string')

  let arregloFecha = date.split('/')
  if (arregloFecha.length !== 3) arregloFecha = date.split('-')
  if (arregloFecha.length !== 3) throw new Error('Entrada no valida')

  let dia = Number.parseInt(arregloFecha[0])
  const mes = Number.parseInt(arregloFecha[1])
  let anho = Number.parseInt(arregloFecha[2])
  if (isNaN(dia) || isNaN(mes) || isNaN(anho)) throw new Error('Entrada no valida ')

  if (dia > 31) [dia, anho] = [anho, dia]

  if (dia > 31 || dia < 1) throw new Error('Dia no valido, el formato debe ser dd/mm/yyyy o yyyy/mm/dd')

  if (mes > 12 || mes < 1) throw new Error('Mes no valido, el formato debe ser dd/mm/yyyy o yyyy/mm/dd')
  if (anho < 1900 || anho > 2100) throw new Error('Año no valido, años soportados van desde 1900 a 2100')

  const _esBisiesto = esBisiesto(anho)
  if (dia >= 30 && mes === 2) throw new Error('Día no valido para el mes de febrero')
  if (dia === 29 && mes === 2 && !_esBisiesto) throw new Error('Día no valido para el mes de febrero, año no es bisiesto')

  return [dia, mes, anho].join(separador)
}
export function esBisiesto (anho) {
  const divisibleX4 = (anho % 4) === 0
  const divisibleX100 = (anho % 100) === 0
  const divisibleX400 = (anho % 400) === 0

  if (divisibleX4 && !divisibleX100) return true
  if (divisibleX4 && divisibleX100 && divisibleX400) return true

  return false
}
