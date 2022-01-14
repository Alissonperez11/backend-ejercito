const { pool } = require('../db')
const { ejecutarTransaccion } = require('../transaccion')

const getInstrumentos = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM instrumentos')
    res.json(resultado.rows)
  } catch (error) {
    res.json(error.message)
  }
}

const getEstadoInstrumentos = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM estadoinstrumento')
    res.json(resultado.rows)
  } catch (error) {
    res.json(error.message)
  }
}

const getReporteInstrumentos = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM reporteinstrumento')
    res.json(resultado.rows)
  } catch (error) {
    res.json(error.message)
  }
}

const getInstrumento = async (req, res) => {
  try {
    const { id } = req.params

    const resultado = await pool.query(
      'SELECT * FROM instrumentos WHERE instrumentos_id = $1', 
      [id]
    )

    if(resultado.rows.length === 0){
      return res.status(404).json({
        message: 'Instrumento no encontrado'
      })
    }

    res.json(resultado.rows[0])
  } catch (error) {
    res.json(error.message)
  }
}

const createInstrumentos = async (req, res) => {
  const {
    instrumentos_id,
    mision_id,
    instrumentos_nombre,
    instrumentos_cantidad
  } = req.body

  try {
    const resultado = await pool.query(
      'INSERT INTO instrumentos VALUES($1, $2, $3, $4) RETURNING *', 
      [instrumentos_id, mision_id, instrumentos_nombre, instrumentos_cantidad]
    )
    res.json(resultado.rows[0])
  } catch (error) {
    res.json(error.message)
  }
}

const updateInstrumentos = async (req, res) => {
  const { id } = req.params
  const {
    instrumentos_id,
    instrumentos_cantidad,
    opcion,
  } = req.body

  //const UUID = Math.ceil(Math.random() * 1000)
  try {
    ejecutarTransaccion(async (pool) => {
      const { rows } = await pool.query(
        'SELECT instrumentos_cantidad, estadoinstrumento_danados' +
        ' FROM instrumentos INNER JOIN estadoinstrumento' +
        ' ON instrumentos.instrumentos_id = estadoinstrumento.instrumentos_id' +
        ' WHERE instrumentos.instrumentos_id = $1',
        [id]
      )
  
      const cantidadInstrumentos = rows[0].instrumentos_cantidad
      const sumaInstrumentos = cantidadInstrumentos + instrumentos_cantidad
      const restaInstrumentos = cantidadInstrumentos - instrumentos_cantidad

      const cantidadInstrumentosDanados = rows[0].estadoinstrumento_danados
      const sumaInstrumentosDanados = cantidadInstrumentosDanados + Number(instrumentos_cantidad)
      
      switch (opcion) {
        case 'SUMA':
          await pool.query(
            'UPDATE instrumentos SET instrumentos_cantidad = $1 WHERE instrumentos_id = $2',
            [sumaInstrumentos, instrumentos_id]
          )
          await pool.query(
            'UPDATE estadoinstrumento SET estadoinstrumento_usados = $1 WHERE instrumentos_id = $2',
            [sumaInstrumentos, instrumentos_id]
          )
          await pool.query(
            'INSERT INTO reporteinstrumento VALUES(DEFAULT,$1, $2, $3, $4)',
            [instrumentos_id, new Date(),'AGREGADOS', instrumentos_cantidad]
          )
          res.json({ message: 'Se realizó correctamente la transacción de datos'})
          break;
        case 'RESTA':
          if (instrumentos_cantidad <= cantidadInstrumentos) {
            await pool.query(
              'UPDATE instrumentos SET instrumentos_cantidad = $1 WHERE instrumentos_id = $2',
              [restaInstrumentos, instrumentos_id]
            )
            await pool.query(
              'UPDATE estadoinstrumento SET estadoinstrumento_danados = $1 WHERE instrumentos_id = $2',
              [sumaInstrumentosDanados, instrumentos_id]
            )
            await pool.query(
              'INSERT INTO reporteinstrumento VALUES(DEFAULT,$1, $2, $3, $4)',
              [instrumentos_id, new Date(),'DAÑADOS', instrumentos_cantidad]
            )
            res.json({ message: 'Se realizó correctamente la transacción de datos' })
          } else {
            res.json({ message: 'No se realizó la transacción de datos' })
          }
          break;
        default:
          res.json({ message: 'No se realizó la transacción de datos' })
      }
    })
  } catch (error) {
    res.json(error.message)
  }
}

module.exports = {
  getInstrumentos,
  createInstrumentos,
  updateInstrumentos,
  getInstrumento,
  getEstadoInstrumentos,
  getReporteInstrumentos
}