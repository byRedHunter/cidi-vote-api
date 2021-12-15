const express = require('express')
const cors = require('cors')

const { dbConnection } = require('../config/db')

class Server {
	constructor() {
		this.app = express()
		this.port = process.env.PORT
		this.paths = {
			auth: '/api/auth',
			user: '/api/user',
			election: '/api/election',
			reports: '/api/reports',
			search: '/api/search',
		}

		// conectar con la db
		this.connectDB()

		// middlewares
		this.middlewares()

		// rutas de la app
		this.routes()
	}

	async connectDB() {
		await dbConnection()
	}

	middlewares() {
		// habilitar cors
		this.app.use(cors())

		// lectura y parseo del body
		this.app.use(express.json())

		// directorio publico
		this.app.use(express.static('public'))
	}

	routes() {
		this.app.use(this.paths.auth, require('../routes/auth.route'))
		this.app.use(this.paths.election, require('../routes/election.route'))
		this.app.use(this.paths.user, require('../routes/user.route'))
		this.app.use(this.paths.reports, require('../routes/reports.route'))
		this.app.use(this.paths.search, require('../routes/search.route'))
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log(`Server run on port ${this.port}`)
		})
	}
}

module.exports = Server
