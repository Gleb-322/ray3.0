const Patients = require('../models/patient')
const Admin = require('../models/admin')
const bcrypt = require('bcryptjs')

const getPatients = async (req, res) => {
	try {
		const patients = await Patients.find({})

		res.send({
			body: patients,
			errorMessage: null,
			success: true,
			errorCode: 0,
		})
	} catch (e) {
		res.status(200).send({
			body: null,
			errorMessage: e.message,
			success: false,
			errorCode: 1,
		})
	}
}

const loginAdmin = async (req, res) => {
	try {
		const admin = await Admin.findOne({
			login: req.body.login,
		})

		if (!admin) {
			throw new Error('Неверный логин!')
		}

		const isMatch = await bcrypt.compare(req.body.password, admin.password)

		if (!isMatch) {
			throw new Error('Неверный пароль!')
		}

		const token = await admin.generateAuthToken()
		res.send({
			body: admin,
			token,
			errorMessage: null,
			success: true,
			errorCode: 0,
		})
	} catch (e) {
		res.status(200).send({
			body: null,
			token: null,
			errorMessage: e.message,
			success: false,
			errorCode: 1,
		})
	}
}

const updatePatients = async (req, res) => {
	try {
		const date = await Patients.findOne({ date: req.body.date })
		if (date) {
			throw new Error('Date alredy exists!')
		}
		const patient = await Patients.findOneAndUpdate(
			{
				_id: req.params.id,
			},
			req.body,
			{
				returnDocument: 'after',
			}
		)
		if (!patient) {
			return res.status(404).send('Patient not found')
		}

		res.send(patient)
	} catch (e) {
		res.status(400).send({ error: e.message })
	}
}

const deletePatients = async (req, res) => {
	try {
		const patient = await Patients.findOneAndDelete({ _id: req.params.id })
		if (!patient) {
			return res.status(404).send('Patient not found')
		}
		res.send(patient)
	} catch (e) {
		res.status(400).send({ error: e.message })
	}
}

const logoutAdmin = async (req, res) => {
	try {
		req.admin.tokens = req.admin.tokens.filter(
			token => token.token !== req.token
		)

		await req.admin.save()
		res.send('Succes loguot!')
	} catch (e) {
		res.status(500).send({ error: e.message })
	}
}

module.exports = {
	getPatients,
	loginAdmin,
	updatePatients,
	deletePatients,
	logoutAdmin,
}
