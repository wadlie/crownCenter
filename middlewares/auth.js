const jwt = require('jsonwebtoken');
var env = process.env.NODE_ENV || 'development';
const config =  require(__dirname + '/../config/config.js')[env];

const checkAuth = (req, res, next) => {
	if(env != 'development'){
		var token = req.headers['token'];
		if (!token)
			return res.status(403).send({ auth: false, message: 'No token provided.' });

		jwt.verify(token, config.jwtSecret, (err, decoded) => {
			if (err)
				return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

		req.user = {
				login: decoded.login,
				id: decoded.id
			};
		next();
		});
	}else{
		next()
	}
}

module.exports = {
	checkAuth
}