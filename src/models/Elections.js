const { Schema, model } = require('mongoose')

const ElectionSchema = Schema({
	position: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		required: true,
		trim: true,
	},
	candidates: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	voters: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	hasVoted: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	votes: [
		{
			candidate: {
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
			amount: { type: Number },
		},
	],
	private: {
		type: Boolean,
		required: true,
		default: false,
	},
	state: {
		// si la eleccion esta activa o no
		type: Boolean,
		required: true,
		default: true,
	},
	deleted: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		require: true,
	},
})

ElectionSchema.methods.toJSON = function () {
	const { __v, _id, ...infoElection } = this.toObject()
	infoElection.uid = _id

	return infoElection
}

module.exports = model('Election', ElectionSchema)
