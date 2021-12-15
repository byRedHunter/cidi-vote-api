const express = require('express')
const { pdfByCandidates } = require('../controllers/reports.controller')

const router = express.Router()

router.get('/candidates/:uidElection', pdfByCandidates)

module.exports = router
