const { Router } = require('express')
const { check } = require('express-validator')
const { loginUser } = require('../controllers/auth.controller')
const { validateField } = require('../middlewares')

const router = Router()

router.post(
	'/login',
	[
		check('dni', 'Ingrese su número de DNI').not().isEmpty(),
		check('password', 'Ingrese su contraseña').not().isEmpty(),
		validateField,
	],
	loginUser
)

module.exports = router
