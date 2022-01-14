const { pool } = require('../db')

const getPeticionesAscenso = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM peticion_ascenso')
    res.json(resultado.rows)
  } catch (error) {
    res.json(error.message)
  }
}

const createPeticionAscenso = async (req, res) => {
  const { peticion_ascenso_id, rango_id, soldado_id, peticion_ascenso_fecha,
    peticion_ascenso_observaciones, peticion_ascenso_aprobacion } = req.body
  try {
    const resultado = await pool.query(
      'INSERT INTO peticion_ascenso VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      [ peticion_ascenso_id, rango_id, soldado_id, peticion_ascenso_fecha,
        peticion_ascenso_observaciones, peticion_ascenso_aprobacion]
    )
    res.json(resultado.rows[0])
  } catch (error) {
    res.json(error.message)
  }
}

const updatePeticionAscenso = async (req, res) => {
  const { id } = req.params
  let { peticion_ascenso_id, rango_id, soldado_id, peticion_ascenso_fecha,
    peticion_ascenso_observaciones, peticion_ascenso_aprobacion } = req.body

  try {
    const resultado = await pool.query(
      'SELECT * FROM peticion_ascenso WHERE peticion_ascenso_id = $1', 
      [id]
    )

    if(resultado.rows.length === 0){
      await pool.query(
        'INSERT INTO peticion_ascenso VALUES($1, $2, $3, $4, $5, $6)',
        [ peticion_ascenso_id, rango_id, soldado_id, new Date(peticion_ascenso_fecha),
          peticion_ascenso_observaciones, Boolean(peticion_ascenso_aprobacion).constructor() ]
      )
      res.json({message: 'Inserción realizada con éxito'})
    } else {
      await pool.query(
        'UPDATE peticion_ascenso SET rango_id = $1, peticion_ascenso_fecha = $2,' +
        ' peticion_ascenso_observaciones = $3, peticion_ascenso_aprobacion = $4' +
        ' WHERE peticion_ascenso_id = $5',
        [ rango_id, peticion_ascenso_fecha,
          peticion_ascenso_observaciones, peticion_ascenso_aprobacion, id ]
      )
      res.json({message: 'Actualización exitosa'})
    }
  } catch (error) {
    res.json(error.message)
  }
}

const deletePeticionAscenso = async (req, res) => {
  const { id } = req.params
  try {
    const resultado = await pool.query(
      'SELECT * FROM peticion_ascenso WHERE peticion_ascenso_id = $1', 
      [id]
    )

    if(resultado.rows.length === 0){
      return res.status(404).json({
        message: 'Petición de ascenso no encontrada'
      })
    } else {
      await pool.query(
        'DELETE FROM peticion_ascenso WHERE peticion_ascenso_id = $1',
        [id]
      )
      res.json({message: 'Eliminación con éxito'})
    }
  } catch (error) {
    res.json(error.message)
  }
}

module.exports = {
  getPeticionesAscenso,
  createPeticionAscenso,
  updatePeticionAscenso,
  deletePeticionAscenso
}