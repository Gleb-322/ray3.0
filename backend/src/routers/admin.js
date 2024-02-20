const express = require('express')
const { getPatients, loginAdmin } = require('../controllers/admin')

const router = new express.Router()

router.post('/admin/login', loginAdmin)
router.get('/admin/patients', getPatients)

module.exports = router
