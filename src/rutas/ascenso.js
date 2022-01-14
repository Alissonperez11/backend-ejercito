const { Router } = require('express')
const router = Router()

const {
  getPeticionesAscenso,
  createPeticionAscenso,
  updatePeticionAscenso,
  deletePeticionAscenso
} = require('../controladores/ascenso')

router.get('/', getPeticionesAscenso)

router.post('/', createPeticionAscenso)

router.put('/:id', updatePeticionAscenso)

router.delete('/:id', deletePeticionAscenso)

module.exports = router