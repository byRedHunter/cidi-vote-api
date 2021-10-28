const { request, response } = require('express')
const bcryptjs = require('bcryptjs')

const { User } = require('../models')
const { generateJWT } = require('../helpers')

const loginUser = async (req = request, res = response) => {
	const { dni, password } = req.body

	try {
		// verificar si el dni existe
		const user = await User.findOne({ dni })
		if (!user)
			return res.status(400).json({ msg: 'DNI o contraseña incorrectos' })

		// verificar si el usuario esta activo
		if (!user.state)
			return res
				.status(400)
				.json({ msg: 'DNI o contraseña incorrectos - state' })

		// verificar contraseña
		const validPassword = bcryptjs.compareSync(password, user.password)
		if (!validPassword)
			return res.status(400).json({ msg: 'DNI o contraseña incorrectos' })

		// generar el JWT
		const token = await generateJWT(user._id)

		res.json({
			user,
			token,
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			msg: 'Error en el servidor',
		})
	}
}

module.exports = { loginUser }
