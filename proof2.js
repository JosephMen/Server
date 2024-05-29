/* eslint-disable */

import express from 'express'
import multer from 'multer'
// import bodyParser from 'body-parser'

// const {urlencoded, json} = bodyParser
const upload = multer()
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(multer().array())
app.get('/', (req, res, next) => {
    return res.send('<h1>hello world</h1>')
})
app.post('/', (req, res) => {
    console.log("body", req.body)
    return res.json(req.body)
})

const port = 1000

app.listen(port, () => {
    console.log(`listening in http://localhost:${port}`)
})