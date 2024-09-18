/* eslint-disable */
// import 
import z from 'zod'

const schema = z.object({
    opcional: z.string().default('hola mundo')
})
const objeto = schema.partial().safeParse({})
console.log(objeto.data)