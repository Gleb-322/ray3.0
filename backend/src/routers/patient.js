const express = require('express')
const {
	createPatient,
	getTimeByDate,
	getDisabledDates,
} = require('../controllers/patients')

const router = new express.Router()

router.post('/patients', createPatient)
router.post('/patients/time', getTimeByDate)
router.post('/patients/disabledDates', getDisabledDates)

module.exports = router
