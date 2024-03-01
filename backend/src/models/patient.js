const mongoose = require('mongoose')

const patientsShema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		default: '',
	},
	date: {
		type: Date,
		required: true,
	},
	time: {
		type: String,
		required: true,
		trim: true,
	},
})

const Patients = new mongoose.model('Patients', patientsShema)

module.exports = Patients
