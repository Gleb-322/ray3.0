const express = require('express')
const {
	getDisabledDates,
	postDisabledDates,
	postUndisabledDates,
} = require('../controllers/disabledDates')

const router = new express.Router()
router.post('/disabledDates', postDisabledDates)
router.post('/undisabledDates', postUndisabledDates)
router.get('/disabledDates', getDisabledDates)
module.exports = router
