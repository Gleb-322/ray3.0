const Patients = require('../models/patient')
const Admin = require('../models/admin')

const getPatients = async (req, res) => {
	try {
		const patients = await Patients.find({})
		res.send(patients)
	} catch (e) {
		res.status(500).send(e)
	}
}

const loginAdmin = async (req, res) => {
	try {
		const admin = await Admin.findOne({
			login: req.body.login,
			password: req.body.password,
		})

		if (!admin) {
			throw new Error('Unable to login!')
		}

		const token = await admin.generateAuthToken()
		console.log(token)
		res.send({ admin, token })
	} catch (e) {
		res.status(400).send({ error: e.message })
	}
}

module.exports = { getPatients, loginAdmin }
