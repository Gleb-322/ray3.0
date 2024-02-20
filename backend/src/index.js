const express = require('express')
require('./db/mongoose')
const patientsRouter = require('./routers/patient')
const adminRouter = require('./routers/admin')
const Admin = require('./models/admin')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(patientsRouter)
app.use(adminRouter)

app.listen(port, () => {
	console.log(`App is up on port ${port}`)
})

// const f = async () => {
// 	const createAdmin = new Admin({
// 		login: 'admin',
// 		password: 'admin',
// 	})
// 	await createAdmin.save()
// }
// f()
