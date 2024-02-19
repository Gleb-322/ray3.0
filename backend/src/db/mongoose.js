const mongoose = require('mongoose')

const URL =
	'mongodb+srv://Gleb:Essential98@ray.pr1rab9.mongodb.net/ray-api?retryWrites=true&w=majority'
mongoose
	.connect(URL)
	.then(res => console.log('connected to MongoDB'))
	.catch(err => console.log(`error to connection: ${err}`))
