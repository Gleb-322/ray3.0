const express = require('express')
const { createPatient, getTimeByDate } = require('../controllers/patients')

const router = new express.Router()

router.post('/patients', createPatient)
router.post('/patients/time', getTimeByDate)

module.exports = router
