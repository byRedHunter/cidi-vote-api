const { request, response } = require('express')
const ObjectId = require('mongoose').Types.ObjectId
const { Election } = require('../models')

const getAllElections = async (req = request, res = response) => {
	const query = req.query || null
	const filter = query?.state ? Number(query.state) : null

	try {
		const electionList = await Election.find(
			filter ? { state: filter, deleted: false } : { deleted: false },
			{
				_id: 1,
				position: 1,
				description: 1,
				state: 1,
			}
		).sort([['createdAt', -1]])

		res.status(200).json(electionList)
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor.' })
	}
}

const getElectionsByUser = async (req = request, res = response) => {
	const user = req.userAuthtenticated

	try {
		const electionUser = await Election.find(
			{
				// elecciones a las que pertenece el usuario con sesion y aun no ha registrado su voto es la eleccion
				$and: [{ voters: user._id }, { $nor: [{ hasVoted: user._id }] }],
			},
			{
				_id: 1,
				position: 1,
				description: 1,
			}
		).sort([['createdAt', -1]])

		res.status(200).json(electionUser)
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor.' })
	}
}

const getPublicElectionsByUser = async (req = request, res = response) => {
	const user = req.userAuthtenticated

	try {
		const electionPublic = await Election.find(
			{
				// elecciones publicas que aun no hay votado
				$and: [
					{ deleted: false, state: true, private: false },
					{ $nor: [{ hasVoted: user._id }] },
				],
			},
			{
				_id: 1,
				position: 1,
				description: 1,
			}
		).sort([['createdAt', -1]])

		res.status(200).json(electionPublic)
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor.' })
	}
}

const getAllPrivateElections = async (req = request, res = response) => {
	try {
		const electionList = await Election.find(
			{ state: true, deleted: false, private: true },
			{
				_id: 1,
				position: 1,
				description: 1,
			}
		)
			//.where({ hasVoted: { $exists: true, $size: 0 } })
			.sort([['createdAt', -1]])

		res.status(200).json(electionList)
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor.' })
	}
}

const getAllCandidates = async (req = request, res = response) => {
	const { id } = req.params

	try {
		const electionList = await Election.findById(id).populate({
			path: 'candidates',
		})

		res.status(200).json(electionList.candidates)
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor.' })
	}
}

const createElection = async (req = request, res = response) => {
	try {
		const info = req.body

		const election = new Election(info)
		await election.save()

		const { position, description, state, _id } = election

		res.status(200).json({ uid: _id, position, description, state })
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor' })
	}
}

const updateElection = async (req = request, res = response) => {
	const { id } = req.params
	const { state, createdAt, votes, hasVoted, voters, candidates, ...resInfo } =
		req.body

	try {
		await Election.findByIdAndUpdate(id, resInfo)

		res.status(200).json({ msg: 'Datos actualizados correctamente' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor' })
	}
}

const closeElection = async (req = request, res = response) => {
	const { id } = req.params

	try {
		const election = await Election.findByIdAndUpdate(
			id,
			{ state: false },
			{ new: true }
		)
		const { _id, position, state } = election

		res.status(200).json({ uid: _id, position, state })
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor' })
	}
}

const openElection = async (req = request, res = response) => {
	const { id } = req.params

	try {
		const election = await Election.findByIdAndUpdate(
			id,
			{ state: true },
			{ new: true }
		)
		const { _id, position, state } = election

		res.status(200).json({ uid: _id, position, state })
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor' })
	}
}

const deleteElection = async (req = request, res = response) => {
	const { id } = req.params

	try {
		const election = await Election.findByIdAndUpdate(
			id,
			{ deleted: true },
			{ new: true }
		)
		const { _id, deleted } = election

		res.status(200).json({ uid: _id, deleted })
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor' })
	}
}

const addCandidates = async (req = request, res = response) => {
	try {
		const election = await Election.findById(req.params.id)

		if (election.candidates.includes(new ObjectId(req.body.userId)))
			return res.status(400).json({ msg: 'El candidato ya ha sido registrado' })

		election.candidates.push(req.body.userId)
		await election.save()

		const { _id, candidates } = election

		res.status(200).json({ uid: _id, candidates })
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor' })
	}
}

const removeCandidate = async (req = request, res = response) => {
	try {
		const election = await Election.findById(req.params.id)

		const index = election.candidates.indexOf(new ObjectId(req.body.userId))

		if (!index) return res.status(400).json({ msg: 'Este candidato no existe' })

		election.candidates.splice(index, 1)
		await election.save()

		const { _id, candidates } = election

		res.status(200).json({ uid: _id, candidates })
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor' })
	}
}

const addVoters = async (req = request, res = response) => {
	try {
		const election = await Election.findById(req.params.id)

		if (election.voters.includes(new ObjectId(req.body.userId)))
			return res.status(400).json({ msg: 'Este votante ya ha sido registrado' })

		election.voters.push(req.body.userId)
		await election.save()

		const { _id, voters } = election

		res.status(200).json({ uid: _id, voters })
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor' })
	}
}

const registerVote = async (req = request, res = response) => {
	try {
		const user = req.userAuthtenticated
		const { candidateId } = req.body
		const election = await Election.findById(req.params.id)

		// si el usuario con session pertenece a esta eleccion y la eleccion es privada
		if (election.private) {
			const includeInElection = election.voters.find(
				(vote) => ObjectId(vote).toString() === String(user._id)
			)
			if (!includeInElection)
				return res.status(200).json({ msg: 'No perteneces a esta elección' })
		}

		// si el candidato elegido pertenece a esta eleccion
		const existCandidate = election.candidates.find(
			(vote) => ObjectId(vote).toString() === String(candidateId)
		)
		if (!existCandidate)
			return res.status(200).json({ msg: 'Este candidato no existe' })

		// verificar si el usuario ya voto
		const userVoted = election.hasVoted.find(
			(vote) => ObjectId(vote).toString() === String(user._id)
		)
		if (userVoted)
			return res.status(200).json({ msg: 'Ud ya ha registrado su voto' })

		// si es el primer voto para este candidato
		const canCanditateVote = election.votes.find(
			(vote) => ObjectId(vote.candidate).toString() === String(candidateId)
		)
		if (!canCanditateVote) {
			election.votes.push({
				candidate: candidateId,
				idCandidtate: candidateId,
				amount: 1,
			})
		} else {
			election.votes.forEach((vote, indice) => {
				if (ObjectId(vote.candidate).toString() === String(candidateId)) {
					election.votes[indice].amount += 1
				}
			})
		}

		election.hasVoted.push(user._id)

		await election.save()

		res.status(200).json({ message: 'Voto registrado' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ msg: 'Error en el servidor' })
	}
}

module.exports = {
	getAllElections,
	getElectionsByUser,
	getAllCandidates,
	getAllPrivateElections,
	getPublicElectionsByUser,
	createElection,
	updateElection,
	closeElection,
	openElection,
	deleteElection,
	addCandidates,
	addVoters,
	registerVote,
	removeCandidate,
}
