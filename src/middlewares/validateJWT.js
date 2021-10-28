const { request, response } = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const validateJWT = async (req = request, res = response, next) => {
	const token = req.header('x-token')

	if (!token) return res.status(401).json({ msg: 'No existe un token' })

	try {
		const { uid } = jwt.verify(token, process.env.SECRETKEY)

		// leer el usuario que corresponse al uid y pasar al siguiente middleware
		const userAuthtenticated = await User.findById(uid)
		if (!userAuthtenticated)
			return res
				.status(401)
				.json({ msg: 'Token no es válido (usuario no existe en DB)' })
		// verifivar que el usuario este activo
		if (!userAuthtenticated.state)
			return res
				.status(401)
				.json({ msg: 'Token no es válido (usuario con status false)' })

		// pasamos el usuario autenticado en el req
		req.userAuthtenticated = userAuthtenticated

		next()
	} catch (error) {
		console.log(error)
		res.status(401).json({
			msg: 'Token no es válido',
		})
	}
}

module.exports = { validateJWT }
