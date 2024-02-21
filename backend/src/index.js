const express = require('express')
require('./db/mongoose')
const patientsRouter = require('./routers/patient')
const adminRouter = require('./routers/admin')
const Admin = require('./models/admin')
const bcrypt = require('bcryptjs')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(patientsRouter)
app.use(adminRouter)

app.listen(port, () => {
	console.log(`App is up on port ${port}`)
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
