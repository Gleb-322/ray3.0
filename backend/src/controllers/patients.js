const Patients = require('../models/patient')

const createPatient = async (req, res) => {
	try {
		const date = await Patients.findOne({ date: req.body.date })
		if (date) {
			throw new Error('This date already exists!')
		}

		const patient = new Patients(req.body)
		await patient.save()
		res.status(201).send(patient)
	} catch (e) {
		res.status(400).send(e.message)
	}
}

const getPatients = async (req, res) => {
	try {
		const patients = await Patients.find({})
		res.send(patients)
	} catch (e) {
		res.status(500).send(e)
	}
}

const loginAdmin = async (req, res) => {}
module.exports = {
	createPatient,
	getPatients,
	loginAdmin,
}
