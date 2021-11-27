const express = require('express')
const { searchInCollection } = require('../controllers/search.controller')
const { validateJWT, isAdminRole, validateField } = require('../middlewares')

const router = express.Router()

router.get(
	'/:collection/:term',
	[validateJWT, isAdminRole, validateField],
	searchInCollection
)

module.exports = router
