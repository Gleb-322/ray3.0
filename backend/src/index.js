const express = require('express')
require('./db/mongoose')
const patientsRouter = require('./routers/patient')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(patientsRouter)

app.listen(port, () => {
	console.log(`App is up on port ${port}`)
})
