// Core de NodeJS
const express = require('express')

// Terceros
const cors = require('cors')
const morgan = require('morgan')

// Opciones de cors
let corsOpciones = {
  origin: '*',
  optionsSuccessStatus: 200
}

// Rutas
const {
  instrumentosRutas,
  soldadoRutas,
  faltasRutas,
  ascensoRutas
} = require('../rutas')

// App
const app = express()

// Router
const router = express.Router()

app
  .use(express.json())
  .use(cors(corsOpciones))
  .use(morgan('dev'))

router.use('/instrumentos', instrumentosRutas)
router.use('/soldado', soldadoRutas)
router.use('/faltas', faltasRutas)
router.use('/ascenso', ascensoRutas)
app.use(router)

module.exports = { app }