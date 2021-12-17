const express = require('express')
const {
	pdfByCandidates,
	resultsElections,
} = require('../controllers/reports.controller')
const { validateField, validateJWT } = require('../middlewares')

const router = express.Router()

router.get('/candidates/:uidElection', pdfByCandidates)

router.get(
	'/results/:uidElection',
	[validateJWT, validateField],
	resultsElections
)

module.exports = router
