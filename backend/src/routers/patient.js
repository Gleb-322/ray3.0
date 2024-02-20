const express = require('express')
const { createPatient } = require('../controllers/patients')

const router = new express.Router()

router.post('/patients', createPatient)

module.exports = router
