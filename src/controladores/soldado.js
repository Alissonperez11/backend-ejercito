const { pool } = require('../db')
const { ejecutarTransaccion } = require('../transaccion')

const getSoldados = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM soldado')
    res.json(resultado.rows)
  } catch (error) {
    res.json(error.message)
  }
}

const getEncargados = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM encargado')
    res.json(resultado.rows)
  } catch (error) {
    res.json(error.message)
  }
}

const getCambiosEncargados = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM cambioencargado')
    res.json(resultado.rows)
  } catch (error) {
    res.json(error.message)
  }
}

const getSoldado = async (req, res) => {
  try {
    const { id } = req.params

    const resultado = await pool.query(
      'SELECT * FROM soldado WHERE soldado_id = $1', 
      [id]
    )

    if(resultado.rows.length === 0){
      return res.status(404).json({
        message: 'Soldado no encontrado'
      })
    }

    res.json(resultado.rows[0])
  } catch (error) {
    res.json(error.message)
  }
}

const createSoldado = async (req, res) => {
  const {
    soldado_id,
    rango_id,
    batallon_id,
    soldado_cedula,
    soldado_nombre,
    soldado_apellido,
    soldado_fechanacimiento,
    soldado_fechaenlistacion,
    soldado_tatuaje,
    soldado_aceptacion
  } = req.body

  try {
    const resultado = await pool.query(
      'INSERT INTO soldado VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', 
      [ soldado_id, rango_id, batallon_id, soldado_cedula, soldado_nombre, soldado_apellido,
        soldado_fechanacimiento, soldado_fechaenlistacion, soldado_tatuaje, soldado_aceptacion ]
    )
    res.json(resultado.rows[0])
  } catch (error) {
    res.json(error.message)
  }
}

const updateSoldado = async (req, res) => {
  const { id } = req.params
  const {
    soldado_id,
    batallon_id,
  } = req.body

  //const UUID = Math.ceil(Math.random() * 1000)
  
  try {
    const SUBTENIENTE = 7

    ejecutarTransaccion(async (pool) => {
      // Anterior encargado
      const anterior = await pool.query(
        'SELECT encargado_id, soldado_id FROM encargado WHERE batallon_id = $1', 
        [batallon_id]
      )
      const anteriorEncargado = anterior.rows[0].encargado_id
      const anteriorSoldado = anterior.rows[0].soldado_id

      const { rows } = await pool.query(
        'SELECT * FROM soldado WHERE soldado_id = $1',
        [id]
      )
      const rango = rows[0].rango_id
      const soldado = rows[0].soldado_id
      const batallon = rows[0].batallon_id

      if(rango === SUBTENIENTE){
        await pool.query(
          'INSERT INTO cambioencargado VALUES(DEFAULT, $1, $2, $3, $4)',
          [anteriorEncargado, 'PENDIENTE', new Date(), anteriorSoldado]
        )
        await pool.query(
          'UPDATE soldado SET rango_id = $1 WHERE soldado_id = $2',
          [rango + 1, id]
        )
        await pool.query(
          'UPDATE encargado SET soldado_id = $1 WHERE batallon_id = $2',
          [soldado, batallon]
        )
        res.json({ message: 'Se realizó correctamente la transacción de datos' })
      } else {
        res.json({ message: 'El soldado no puede ascender a Teniente' })
      }
    })
  } catch (error) {
    res.json(error.message)
  }
}

module.exports = {
  getSoldados,
  createSoldado,
  updateSoldado,
  getSoldado,
  getEncargados,
  getCambiosEncargados
}