const Patients = require('../models/patient')
const Admin = require('../models/admin')
const bcrypt = require('bcryptjs')
const DisabledDates = require('../models/disabledDates')
const { sendEmail } = require('../emails/email')

const getPatients = async (req, res) => {
	try {
		const patients = await req.paginatedResult
		const endIndex = await req.endIndex
		const count = await req.count

		res.send({
			body: patients,
			count,
			errorMessage: null,
			success: true,
			errorCode: 0,
		})
	} catch (e) {
		res.status(200).send({
			body: null,
			count: null,
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
			throw new Error('Неверный логин или пароль!')
		}

		const isMatch = await bcrypt.compare(req.body.password, admin.password)

		if (!isMatch) {
			throw new Error('Неверный логин или пароль!')
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
		console.log(req.body)

		const updatePatientBodyOnbject = {
			name: req.body.name,
			phone: req.body.phone,
			email: req.body.email,
			date: req.body.date,
			time: req.body.time,
			_id: req.body._id,
		}
		const patient = await Patients.findOneAndUpdate(
			{
				_id: req.body._id,
			},
			updatePatientBodyOnbject,
			{
				returnDocument: 'after',
			}
		)

		if (!patient) {
			return res.status(200).send({
				body: null,
				errorMessage: 'Такой пациент не найден!',
				success: false,
				errorCode: 2,
			})
		}

		if (req.body.previousEmail === '' && req.body.email !== '') {
			const result = sendEmail(req.body.email, req.body.date, req.body.time)
			result
				.then(res => {})
				.catch(e => {
					return res.send({
						body: null,
						errorMessage: e.error,
						success: false,
						errorCode: 2,
					})
				})
		}

		if (req.body.previousEmail !== '' && req.body.email !== '') {
			if (
				req.body.previousEmail !== req.body.email ||
				req.body.previousDate !== req.body.date ||
				req.body.previousTime !== req.body.time
			) {
				const result = sendEmail(req.body.email, req.body.date, req.body.time)
				result
					.then(res => {
						console.log(res)
					})
					.catch(e => {
						return res.send({
							body: null,
							errorMessage: e.error,
							success: false,
							errorCode: 2,
						})
					})
			}
		}

		const countOfNewDates = await Patients.find({ date: req.body.date })
		const countOfPrevDates = await Patients.find({
			date: req.body.previousDate,
		})

		if (countOfNewDates.length === 16) {
			if (req.body.date !== req.body.previousDate) {
				const newDisDate = await new DisabledDates({
					disabledDate: req.body.date,
					full: true,
				})
				await newDisDate.save()
			}
		} else {
			await DisabledDates.findOneAndDelete({
				disabledDate: req.body.date,
			})
		}

		if (countOfPrevDates.length === 16) {
			if (req.body.date !== req.body.previousDate) {
				const newDisDate = await new DisabledDates({
					disabledDate: req.body.previousDate,
					full: true,
				})
				await newDisDate.save()
			}
		} else {
			await DisabledDates.findOneAndDelete({
				disabledDate: req.body.previousDate,
			})
		}

		res.send({
			body: patient,
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

const deletePatients = async (req, res) => {
	try {
		const patient = await Patients.findOneAndDelete({ _id: req.params.id })
		if (!patient) {
			return res.send({
				body: null,
				errorMessage: 'Такой пациент не найден!',
				success: false,
				errorCode: 2,
			})
		}

		const patientDate = patient.date

		const checkDisableDate = await DisabledDates.findOne({
			disabledDate: patientDate,
		})

		if (checkDisableDate) {
			await DisabledDates.findOneAndDelete({ disabledDate: patientDate })
		}

		res.send({
			body: patient,
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
