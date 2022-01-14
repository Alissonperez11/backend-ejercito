const { pool } = require('../db')

const getFaltas = async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM tipofalta_disciplinarias')
    res.json(resultado.rows)
  } catch (error) {
    res.json(error.message)
  }
}

const createFalta = async (req, res) => {
  const { falta_disciplinarias_id, faltadisci_gravedad } = req.body
  try {
    const resultado = await pool.query(
      'INSERT INTO tipofalta_disciplinarias VALUES($1, $2) RETURNING *', 
      [falta_disciplinarias_id, faltadisci_gravedad]
    )
    res.json(resultado.rows[0])
  } catch (error) {
    res.json(error.message)
  }
}

const updateFalta = async (req, res) => {
  const { id } = req.params
  const { falta_disciplinarias_id, faltadisci_gravedad } = req.body
  try {
    const resultado = await pool.query(
      'SELECT * FROM tipofalta_disciplinarias WHERE falta_disciplinarias_id = $1', 
      [id]
    )

    if(resultado.rows.length === 0){
      await pool.query(
        'INSERT INTO tipofalta_disciplinarias VALUES($1, $2) RETURNING *', 
        [falta_disciplinarias_id, faltadisci_gravedad]
      )
    } else {
      await pool.query(
        'UPDATE tipofalta_disciplinarias SET faltadisci_gravedad = $1 WHERE falta_disciplinarias_id = $2',
        [faltadisci_gravedad, falta_disciplinarias_id]
      )
    }
  } catch (error) {
    res.json(error.message)
  }
}

const deleteFalta = async (req, res) => {
  const { id } = req.params
  try {
    const resultado = await pool.query(
      'SELECT * FROM tipofalta_disciplinarias WHERE falta_disciplinarias_id = $1', 
      [id]
    )

    if(resultado.rows.length === 0){
      return res.status(404).json({
        message: 'Falta disciplinaria no encontrada'
      })
    } else {
      await pool.query(
        'DELETE FROM tipofalta_disciplinarias WHERE falta_disciplinarias_id = $1',
        [id]
      )
      res.json({message: 'Eliminación con éxito'})
    }
  } catch (error) {
    res.json(error.message)
  }
}

module.exports = {
  getFaltas,
  createFalta,
  updateFalta,
  deleteFalta
}