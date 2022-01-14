const { Router } = require('express')
const router = Router()

const {
  getInstrumentos,
  createInstrumentos,
  updateInstrumentos,
  getInstrumento,
  getEstadoInstrumentos,
  getReporteInstrumentos
} = require('../controladores/instrumentos')

router.get('/', getInstrumentos)

router.get('/estado', getEstadoInstrumentos)

router.get('/reporte', getReporteInstrumentos)

// router.get('/teacher', verifyToken ,subjectController.getSubjectsTeacher)

router.post('/', createInstrumentos)

// router.get('/all', verifyToken ,subjectController.getSubjects)

router.get('/:id', getInstrumento)

router.put('/:id', updateInstrumentos)

// router.delete('/:subjectId', subjectController.delete)

module.exports = router