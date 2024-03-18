const Patients = require('../models/patient')

const createPatient = async (req, res) => {
	try {
		const patient = new Patients(req.body)
		await patient.save()
		res.status(201).send({
			body: patient,
			success: true,
			errorCode: 0,
		})
	} catch (e) {
		res.status(200).send({
			body: e.message,
			success: false,
			errorCode: 1,
		})
	}
}

const getTimeByDate = async (req, res) => {
	const timeArr = [
		'09-00',
		'09-30',
		'10-00',
		'10-30',
		'11-00',
		'11-30',
		'12-00',
		'12-30',
		'13-00',
		'13-30',
		'14-00',
		'14-30',
		'15-00',
		'15-30',
		'16-00',
		'16-30',
	]
	try {
		const dates = await Patients.find({ date: req.body.date })
		if (!dates) {
			return res.send({
				body: timeArr,
				success: true,
				errorCode: 0,
			})
		}
		const timesPatients = dates.map(el => el.time)
		if (timesPatients.lenght === 16) {
			return res.send({
				body: [],
				success: true,
				errorCode: 0,
			})
		}
		const timeByDates = timeArr.filter(t => !timesPatients.includes(t))
		res.send({
			body: timeByDates,
			success: true,
			errorCode: 0,
		})
	} catch (e) {
		res.status(200).send({
			body: e.message,
			success: false,
			errorCode: 1,
		})
	}
}

module.exports = {
	createPatient,
	getTimeByDate,
}
