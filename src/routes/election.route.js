const express = require('express')
const { check } = require('express-validator')
const {
	addCandidates,
	addVoters,
	closeElection,
	createElection,
	deleteElection,
	getAllElections,
	getAllCandidates,
	getAllPrivateElections,
	getElectionsByUser,
	getPublicElectionsByUser,
	openElection,
	registerVote,
	updateElection,
	removeCandidate,
	getAllVoters,
} = require('../controllers/election.controller')
const { existElecctionInDB, existUserInDB } = require('../helpers')
const {
	validateField,
	validateJWT,
	isAdminRole,
	hasRole,
} = require('../middlewares')

const router = express.Router()

// debe estar autenticado y ser administrador para crear una elección
router.post(
	'/',
	[
		validateJWT,
		isAdminRole,
		check('position', 'Ingrese el cargo').not().isEmpty(),
		check('description', 'Ingrese la descripcón del cargo').not().isEmpty(),
		validateField,
	],
	createElection
)

router.get('/', getAllElections)

router.get('/private', getAllPrivateElections)

router.get('/candidates/:id', getAllCandidates)

router.get('/voters/:id', getAllVoters)

// las elecciones a las que pertenece el usuario con sesion y que aun no hay votado
router.get(
	'/list/public',
	[validateJWT, validateField],
	getPublicElectionsByUser
)

// las elecciones publicas y que aun no hay votado
router.get('/list/user', [validateJWT, validateField], getElectionsByUser)

router.put(
	'/:id',
	[
		validateJWT,
		isAdminRole,
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existElecctionInDB),
		validateField,
	],
	updateElection
)

router.put(
	'/close/:id',
	[
		validateJWT,
		isAdminRole,
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existElecctionInDB),
		validateField,
	],
	closeElection
)

router.put(
	'/open/:id',
	[
		validateJWT,
		isAdminRole,
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existElecctionInDB),
		validateField,
	],
	openElection
)

router.delete(
	'/delete/:id',
	[
		validateJWT,
		isAdminRole,
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existElecctionInDB),
		validateField,
	],
	deleteElection
)

router.put(
	'/candidate/:id',
	[
		validateJWT,
		isAdminRole,
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existElecctionInDB),
		check('userId', 'No es un ID válido').isMongoId(),
		check('userId').custom(existUserInDB),
		validateField,
	],
	addCandidates
)

router.put(
	'/candidate/remove/:id',
	[
		validateJWT,
		isAdminRole,
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existElecctionInDB),
		check('userId', 'No es un ID válido').isMongoId(),
		check('userId').custom(existUserInDB),
		validateField,
	],
	removeCandidate
)

router.put(
	'/voters/:id',
	[
		validateJWT,
		isAdminRole,
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existElecctionInDB),
		check('userId', 'No es un ID válido').isMongoId(),
		check('userId').custom(existUserInDB),
		validateField,
	],
	addVoters
)

router.put(
	'/vote/:id',
	[
		validateJWT,
		hasRole('ADMIN_ROLE', 'USER_ROLE'),
		check('id', 'No es un ID válido').isMongoId(),
		check('id').custom(existElecctionInDB),
		check('candidateId', 'No es un ID válido').isMongoId(),
		check('candidateId').custom(existUserInDB),
		validateField,
	],
	registerVote
)

module.exports = router
