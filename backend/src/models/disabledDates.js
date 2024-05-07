const mongoose = require('mongoose')

const disabledDatesSchema = new mongoose.Schema({
	disabledDates: [
		{
			type: String,
		},
	],
})

const DisabledDates = new mongoose.model('DisabledDates', disabledDatesSchema)

module.exports = DisabledDates
