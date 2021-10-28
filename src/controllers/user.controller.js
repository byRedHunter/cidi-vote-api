const { request, response } = require('express')
const bcryptjs = require('bcryptjs')
const { User } = require('../models')
const { paginateConfig } = require('../config/pagination')

const getAllUsers = async (req = request, res = response) => {
	try {
		const limit = Number(req.query.limit) || paginateConfig.limit
		const page = Number(req.query.page) || paginateConfig.page

		const users = await User.paginate(
			{},
			{ limit, page, sort: { createdAt: -1 } }
		)

		res.status(200).json(users)
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor.' })
	}
}

const createUser = async (req = request, res = response) => {
	try {
		const user = new User(req.body)

		const salt = bcryptjs.genSaltSync()
		user.password = bcryptjs.hashSync(req.body.dni, salt)

		await user.save()

		res.status(200).json(user)
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor' })
	}
}

const updateUser = async (req = request, res = response) => {
	const { id } = req.params
	const { state, password, role, ...infoUser } = req.body

	try {
		const user = await User.findByIdAndUpdate(id, infoUser, { new: true })

		res.status(200).json(user)
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor' })
	}
}

const updateUserState = async (req = request, res = response) => {
	const { id } = req.params

	try {
		const user = await User.findByIdAndUpdate(
			id,
			{ state: true },
			{ new: true }
		)

		res.status(200).json(user)
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor' })
	}
}

const updateUserRole = async (req = request, res = response) => {
	const { id } = req.params
	const { role } = req.body

	try {
		const user = await User.findByIdAndUpdate(id, { role }, { new: true })

		res.status(200).json(user)
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor' })
	}
}

const updateUserPassword = async (req = request, res = response) => {
	const { id } = req.params

	try {
		let { password } = req.body

		const salt = bcryptjs.genSaltSync()
		password = bcryptjs.hashSync(password, salt)

		const user = await User.findByIdAndUpdate(id, { password }, { new: true })

		res.status(200).json(user)
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor' })
	}
}

const updateUserImage = async (req = request, res = response) => {}

const deleteUser = async (req = request, res = response) => {
	const { id } = req.params

	try {
		const user = await User.findByIdAndUpdate(
			id,
			{ state: false },
			{ new: true }
		)

		res.status(200).json(user)
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor' })
	}
}

module.exports = {
	createUser,
	deleteUser,
	getAllUsers,
	updateUser,
	updateUserImage,
	updateUserPassword,
	updateUserRole,
	updateUserState,
}
