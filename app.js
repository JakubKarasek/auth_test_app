//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const port = 3000;

const app = express();

mongoose.connect('mongodb://localhost:27017/auth_usersDB');

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
});

const secret = process.env.SECRET;

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model('User', userSchema);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', (req, res) => {
	const newUser = User.create({
		email: req.body.username,
		password: req.body.password,
	});

	if (!newUser) console.log(err);
	else res.render('secrets');
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.post('/login', (req, res) => {
	const email = req.body.username;
	const password = req.body.password;
	User.findOne({ email: email }, (err, foundUser) => {
		if (err) {
			console.log(err);
		} else {
			console.log(foundUser);
			if (foundUser) {
				if (foundUser.password == password) res.render('secrets');
				else console.log('Incorrect password!');
			} else {
				console.log('User not found. Please register first.');
			}
		}
	});
});

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
