const ObjectId = require('mongoose').Types.ObjectId
const { User, Role, Election } = require('../models')

const dniExist = async (dni = '') => {
	const existDNI = await User.findOne({ dni })

	if (existDNI) throw new Error(`El DNI ${dni} ya existe.`)
}

const existUserInDB = async (id = '') => {
	if (!ObjectId.isValid(id)) return

	const user = await User.findById(id)
	if (!user) throw new Error('Este usuario no existe')
}

const isRoleValid = async (role = '') => {
	const existRole = await Role.findOne({ role })

	if (!existRole) throw new Error(`El rol ${role} no existe.`)
}

const existElecctionInDB = async (id = '') => {
	if (!ObjectId.isValid(id)) return

	const election = await Election.findById(id)
	if (!election) throw new Error('Esta elección no existe')
}

module.exports = { existUserInDB, existElecctionInDB, dniExist, isRoleValid }
