module.exports = {
	start: io => {
		io.on('connection', socket => {
			console.log('socket connect')

			global.getCreatedPatient = date => {
				socket.emit('registratedPatient', date)
			}
		})
	},
}
