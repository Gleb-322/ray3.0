const Patients = require('../models/patient')

const pagination = async (req, res, next) => {
	try {
		let paginatedPatients = []
		const page = parseInt(req.query.page)
		const limit = parseInt(req.query.limit)

		const startIndex = (page - 1) * limit
		const endIndex = page * limit

		if (req.query.keyword) {
			paginatedPatients = await Patients.find({
				$or: [
					{ name: new RegExp(req.query.keyword, 'i') },
					{ phone: new RegExp(req.query.keyword, 'i') },
					{
						email: new RegExp(req.query.keyword, 'i'),
					},
					{
						date: new RegExp(req.query.keyword, 'i'),
					},
					{
						time: new RegExp(req.query.keyword, 'i'),
					},
				],
			})
				.limit(limit)
				.skip(startIndex)
		} else {
			paginatedPatients = await Patients.find({}).limit(limit).skip(startIndex)
		}

		if (!paginatedPatients) {
			throw new Error()
		}

		const countPatients = await Patients.countDocuments()

		req.paginatedResult = paginatedPatients
		req.endIndex = endIndex
		req.count = countPatients

		next()
	} catch (e) {
		res.status(200).send({ error: 'mid-re paginate' })
	}
}

module.exports = pagination