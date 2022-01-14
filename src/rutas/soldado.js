const { Router } = require('express')
const router = Router()

const {
  getSoldados,
  createSoldado,
  updateSoldado,
  getSoldado,
  getEncargados,
  getCambiosEncargados
} = require('../controladores/soldado')

router.get('/', getSoldados)

router.get('/encargado', getEncargados)

router.get('/cambioencargado', getCambiosEncargados)

router.post('/', createSoldado)

router.get('/:id', getSoldado)

router.put('/:id', updateSoldado)

module.exports = router