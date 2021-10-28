const express = require('express')
const { check } = require('express-validator')

const { validateField } = require('../middlewares')

const { dniExist, isRoleValid, existUserInDB } = require('../helpers')

const {
	getAllUsers,
	createUser,
	updateUser,
	deleteUser,
} = require('../controllers/user.controller')

const router = express.Router()

router.get('/', getAllUsers)

router.post(
	'/',
	[
		// debe haber un usuario con sesion, validateJWT
		// el usuario debe de ser administrador isAdminRole
		check('dni', 'El DNI es obligatorio').not().isEmpty(),
		check('dni').custom(dniExist),
		check('name', 'El nombre es obligatorio').not().isEmpty(),
		check('lastName', 'El apellido es obligatorio').not().isEmpty(),
		check('role').custom(isRoleValid),
		validateField,
	],
	createUser
)

router.put(
	'/:id',
	[
		// debe haber un usuario con sesion, validateJWT
		// el usuario debe de ser admin or user hasRole('ADMIN_ROLE', 'USER_ROLE')
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existUserInDB),
	],
	updateUser
)

router.delete(
	'/:id',
	[
		// debe haber un usuario con sesion, validateJWT
		// el usuario debe de ser administrador isAdminRole
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existUserInDB),
	],
	deleteUser
)

module.exports = router
