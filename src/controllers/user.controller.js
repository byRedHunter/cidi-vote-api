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
		res.status(500).json({ msg: 'Error en el servidor.' })
	}
}

const updateUser = async (req = request, res = response) => {}

const deleteUser = async (req = request, res = response) => {}

module.exports = {
	createUser,
	deleteUser,
	getAllUsers,
	updateUser,
}
