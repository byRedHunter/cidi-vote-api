const express = require('express')
const { check } = require('express-validator')

const {
	validateField,
	validateJWT,
	isAdminRole,
	hasRole,
} = require('../middlewares')

const { dniExist, isRoleValid, existUserInDB } = require('../helpers')

const {
	getAllUsers,
	createUser,
	updateUser,
	deleteUser,
	updateUserState,
	updateUserRole,
	updateUserPassword,
} = require('../controllers/user.controller')

const router = express.Router()

router.get('/', getAllUsers)

router.post(
	'/',
	[
		// debe haber un usuario con sesion, validateJWT
		validateJWT,
		// el usuario debe de ser administrador isAdminRole
		isAdminRole,
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
		validateJWT,
		// el usuario debe de ser admin or user hasRole('ADMIN_ROLE', 'USER_ROLE')
		hasRole('ADMIN_ROLE', 'USER_ROLE'),
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existUserInDB),
		validateField,
	],
	updateUser
)

router.put(
	'/role/:id',
	[
		// debe haber un usuario con sesion, validateJWT
		validateJWT,
		// el usuario debe de ser administrador isAdminRole
		isAdminRole,
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existUserInDB),
		//check('role', 'El rol es obligatorio').not().isEmpty(),
		check('role').custom(isRoleValid),
		validateField,
	],
	updateUserRole
)

router.put(
	'/password/:id',
	[
		// debe haber un usuario con sesion, validateJWT
		validateJWT,
		// el usuario debe de ser administrador isAdminRole
		hasRole('ADMIN_ROLE', 'USER_ROLE'),
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existUserInDB),
		check('password', 'Ingrese una contraseña válida').isLength({ min: 8 }),
		validateField,
	],
	updateUserPassword
)

router.put(
	'/state/:id',
	[
		// debe haber un usuario con sesion, validateJWT
		validateJWT,
		// el usuario debe de ser administrador isAdminRole
		isAdminRole,
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existUserInDB),
		validateField,
	],
	updateUserState
)

router.delete(
	'/:id',
	[
		// debe haber un usuario con sesion, validateJWT
		validateJWT,
		// el usuario debe de ser administrador isAdminRole
		isAdminRole,
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existUserInDB),
		validateField,
	],
	deleteUser
)

module.exports = router
