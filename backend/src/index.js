const express = require('express')
require('./db/mongoose')
const cors = require('cors')
const patientsRouter = require('./routers/patient')
const adminRouter = require('./routers/admin')
const disableDatesRouter = require('./routers/disabledDates')
const Admin = require('./models/admin')
const bcrypt = require('bcryptjs')

const app = express()

// const WSServer = require('express-ws')(app)

const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(patientsRouter)
app.use(adminRouter)
app.use(disableDatesRouter)

app.listen(PORT, () => {
	console.log(`App is up on port ${PORT}`)
})

// const f = async () => {
// 	const password = await bcrypt.hash(process.env.PASS, 8)
// 	console.log(password)
// 	const createAdmin = new Admin({
// 		login: process.env.LOGIN,
// 		password,
// 	})
// 	await createAdmin.save()
// }
// f()
