const uuid = require('uuid')
const cookie = require('cookie-signature')

function getSessionCookie(cookieString, cookieName) {
	return cookieString
		.split(';')
		.filter(pair => {
			return pair.split('=')[0] === cookieName
		})
		.map(pair => {
			return pair.split('=')[1]
		})[0]
}

function session(req, res, ctx, done) {
	let cookieVal
	if (req.headers.cookie && getSessionCookie(req.headers.cookie, 'LebronCookie')) {
		cookieVal = getSessionCookie(req.headers.cookie, 'LebronCookie')
	} else {
		cookieVal = cookie.sign(uuid.v1(), ctx.localConfig.serverSecret)
		res.setHeader('Set-Cookie', 'LebronCookie=' + cookieVal)
	}
	ctx.sessionId = cookie.unsign(cookieVal, ctx.localConfig.serverSecret)
	return done()
}

module.exports = session
