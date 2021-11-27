const { request, response } = require('express')
const { ObjectId } = require('mongoose').Types
const { User } = require('../models')

const colectionsInDB = ['user', 'role', 'election']

const searchUser = async (term = '', res = response) => {
	const isMongoId = ObjectId.isValid(term)

	if (isMongoId) {
		const user = await User.findById(term)

		return res.json(user ? user : {})
	}

	const regex = new RegExp(term, 'i') // insensible a mayus o minus

	const users = await User.find({
		$or: [{ name: regex }, { lastName: regex }, { dni: regex }],
		$and: [{ state: true }],
	})

	return res.json(users)
}

const searchInCollection = (req = request, res = response) => {
	const { collection, term } = req.params

	if (!colectionsInDB.includes(collection))
		return res
			.status(400)
			.json({ message: `Las colecciones permitidas son: ${colectionsInDB}` })

	switch (collection) {
		case 'user':
			searchUser(term, res)
			break
	}
}

module.exports = { searchInCollection }
