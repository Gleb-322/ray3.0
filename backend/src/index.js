const express = require('express')

require('./db/mongoose')

const { createServer } = require('http')
const { Server } = require('socket.io')

const socket = require('./socket')

const cors = require('cors')

const patientsRouter = require('./routers/patient')
const adminRouter = require('./routers/admin')
const disableDatesRouter = require('./routers/disabledDates')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
	cors: {
		origin: 'http://localhost:4200',
	},
})

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(patientsRouter)
app.use(adminRouter)
app.use(disableDatesRouter)

app.all('*', (req, res, next) => {
	const routeError = new Error(
		`Невозможно найти рут: ${req.originalUrl} на сервере`
	)
	routeError.status = 'Ошибка сервера'
	routeError.statusCode = 404
	next(routeError)
})

app.use((error, req, res, next) => {
	error.statusCode = error.statusCode || 500
	error.status = error.status || 'Ошибка сервера'
	res.status(error.statusCode).json({
		status: error.statusCode,
		message: error.message,
	})
})

socket.start(io)

httpServer.listen(PORT, () => {
	console.log(`App is up on port ${PORT}`)
})

// const Admin = require('./models/admin')
// const bcrypt = require('bcryptjs')

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
