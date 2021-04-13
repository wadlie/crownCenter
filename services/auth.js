const Users = require('../models').User;
var env = process.env.NODE_ENV || 'development';
const config =  require(__dirname + '/../config/config.js')[env];
const CustomError = require('../customError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authenticate = params => {
	return Users.findOne({
		where: {
			login: params.login
		},
		raw: true
	}).then(user => {
		if (!user)
			throw new CustomError('Authentication failed. User not found.');

		if (!bcrypt.compareSync(params.password || '', user.password))
			throw new CustomError('Authentication failed. Wrong password.');

		const payload = {
			login: user.login,
			id: user.id,
			time: new Date()
		};
		if(user.login == 'admin'){
			var token = jwt.sign(payload, config.jwtSecret, {
				
			});
		}else{
			var token = jwt.sign(payload, config.jwtSecret, {
				expiresIn: config.tokenExpireTime
			});
		}

		return token;
	});
}

function login(req, res){
	return authenticate(req.body)
	.then(token => {
		res.send({
			success: true,
			data: { token }
		});
	})
	.catch(err => {
		if (err.type === 'custom'){
			return res.send({
				success: false,
				message: err.message
			});
		}
		return res.send({
			success: false,
			message: 'Authentication failed. Unexpected Error.'
		});
	})
};

function register(req, res){
	var login = req.body.login;
	return Users.findOne({where: {login: login || ''}})
	.then(exists => {

		if (exists){
			return res.send({
				success: false,
				message: 'Registration failed. User with this email already registered.'
			});
		}

		var user = {
			login: req.body.login,
			password: bcrypt.hashSync(req.body.password, config.saltRounds)
		}

		return Users.create(user)
		.then(() => res.send({success: true}));
	});
};

module.exports = {
	login,
	register
}