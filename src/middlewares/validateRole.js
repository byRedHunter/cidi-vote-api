const { request, response } = require('express')

const isAdminRole = (req = request, res = response, next) => {
	if (!req.userAuthtenticated)
		return res
			.status(500)
			.json({ msg: 'Quiere verificar el rol sin autenticarse primero.' })

	const { role, name } = req.userAuthtenticated

	if (role !== 'ADMIN_ROLE')
		return res.status(401).json({
			msg: `${name} no es administrador, no puede ejecutar esta acción`,
		})

	next()
}

const hasRole = (...roles) => {
	// ...roles junta todos los argumentos en un array
	return (req = request, res = response, next) => {
		if (!req.userAuthtenticated)
			return res
				.status(500)
				.json({ msg: 'Quiere verificar el rol sin autenticarse primero.' })

		const user = req.userAuthtenticated

		if (!roles.includes(user.role))
			return res
				.status(401)
				.json({ msg: `El servicio requiere uno de estos roles ${roles}.` })

		next()
	}
}

module.exports = {
	isAdminRole,
	hasRole,
}
