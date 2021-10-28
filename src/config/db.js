const mongoose = require('mongoose')

const dbConnection = async () => {
	try {
		const db = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})

		console.log(`DB connected to ${db.connection.name}`)
	} catch (error) {
		console.error(error)
		throw new Error('Error al iniciar la DB.')
	}
}

module.exports = {
	dbConnection,
}
