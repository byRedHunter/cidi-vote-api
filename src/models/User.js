const { Schema, model } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const UserSchema = Schema({
	name: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
	},
	lastName: {
		type: String,
		required: [true, 'El apellido es obligatorio'],
	},
	dni: {
		type: String,
		unique: true,
		required: [true, 'El DNI es obligatorio'],
	},
	password: {
		type: String,
		required: [true, 'La contraseña es obligatoria'],
	},
	image: {
		type: String,
	},
	role: {
		type: String,
		required: true,
		default: 'USER_ROLE',
		enum: ['ADMIN_ROLE', 'USER_ROLE'],
	},
	state: {
		type: Boolean,
		default: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
})

UserSchema.plugin(mongoosePaginate)

UserSchema.methods.toJSON = function () {
	const { __v, password, _id, ...infoUser } = this.toObject()
	infoUser.uid = _id

	return infoUser
}

module.exports = model('User', UserSchema)
