const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)

const sendEmail = async (adress, date, time) => {
	const messageData = {
		from: {
			email: 'raycheva.org@gmail.com',
		},
		personalizations: [
			{
				to: [
					{
						email: adress,
					},
				],
				dynamic_template_data: {
					date: date,
					time: time,
				},
			},
		],
		template_id: 'd-df05c46554e74556ae10239718e2bbcd',
	}
	try {
		await sgMail.send(messageData)
		console.log('sent message')
	} catch (e) {
		console.log(e)
	}
}

module.exports = {
	sendEmail,
}
