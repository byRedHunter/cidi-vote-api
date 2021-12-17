const { request, response } = require('express')
const PDF = require('pdfkit-construct')
const { Election } = require('../models')

const resultsElections = async (req = request, res = response) => {
	const { uidElection } = req.params

	try {
		const election = await Election.findById(uidElection, {
			votes: 1,
		}).populate({ path: 'votes.candidate' })

		const { votes } = election

		res.json(votes)
	} catch (error) {
		console.log('ERROR AL CREAR REPORTE', error)
		res.json({ msg: 'Error al ver los resultados.' })
	}
}

const pdfByCandidates = async (req = request, res = response) => {
	const { uidElection } = req.params

	try {
		const election = await Election.findById(uidElection, {
			candidates: 1,
		}).populate({ path: 'candidates' })
		const { candidates } = election

		const doc = new PDF({ bufferPages: true }) // transferencia de paginas a un archivo de salida

		const filename = `candidates-${uidElection}`

		const stream = res.writeHead(200, {
			'Content-Type': 'application/pdf',
			'Content-disposition': `attachment;filename=${filename}`,
		})

		doc.on('data', (data) => {
			stream.write(data)
		})
		doc.on('end', () => {
			stream.end()
		})

		doc.addTable(
			[
				{ key: 'image', label: 'Foto', align: 'left' },
				{ key: 'dni', label: 'DNI', align: 'left' },
				{ key: 'name', label: 'Nombre', align: 'left' },
				{ key: 'lastName', label: 'Apellido', align: 'left' },
			],
			candidates,
			{
				border: null,
				width: 'fill_body',
				striped: true,
				stripedColors: ['#f6f6f6', '#d6c4dd'],
				cellsPadding: 10,
				marginLeft: 45,
				marginRight: 45,
				headAlign: 'center',
			}
		)

		doc.render()
		doc.end()
	} catch (error) {
		console.log('ERROR AL CREAR REPORTE')
		res.json(error)
	}
}

module.exports = { pdfByCandidates, resultsElections }
