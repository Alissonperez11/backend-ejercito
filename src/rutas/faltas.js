const { Router } = require('express')
const router = Router()

const {
  getFaltas,
  createFalta,
  updateFalta,
  deleteFalta
} = require('../controladores/faltadisciplinarias')

router.get('/', getFaltas)

router.post('/', createFalta)

router.put('/:id', updateFalta)

router.delete('/:id', deleteFalta)

module.exports = router