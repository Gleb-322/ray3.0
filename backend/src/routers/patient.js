const express = require('express')
const {
	createPatient,
	getPatients,
	loginAdmin,
} = require('../controllers/patients')

const router = new express.Router()

router.post('/patients', createPatient)
router.get('/patients', getPatients)
router.post('/admin/login', loginAdmin)

module.exports = router
