var express = require('express');
const bcrypt = require('bcrypt');
const rounds = 10;
var router = express.Router();

var pool = require('./pool');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res) {
	const data = req.body;
	const saltRounds = 10;
	const yourPassword = data.password;
  
	bcrypt.genSalt(saltRounds, (err, salt) => {
	  bcrypt.hash(yourPassword, salt, (err, hash) => {
		pool.query(`INSERT INTO users (user_name, password) VALUES ('${data.userName}', '${hash}') RETURNING u_id`, (error, result) => {
  
		  if(error){
			res.status(404).send(error.message);
		  } else{
			
			// Create a new userbasket for the user
			const u_id = result.rows[0].u_id;
			pool.query(`INSERT INTO userbasket (u_id) VALUES (${u_id}) RETURNING cart_id`, (err, response) => {
			  if (err) {
				res.status(404).send(err.message);
			  } else {
				const cart_id = response.rows[0].cart_id;
				res.status(200).json({ u_id, cart_id });
			  }
			});
		  }   
		});
	  });
	});
  });

  router.post('/login', function(req, res) {
	const data = req.body;
	const yourPassword = data.password;  
	pool.query(`SELECT (password), u_id FROM users WHERE user_name='${data.userName}'`, (error, result) => {
	  if(error){
		res.status(404).send(error.message)
	  }else{
		bcrypt.compare(yourPassword, result.rows[0].password, (err, pass) => {
		  if(err) res.status(404).send(err.message);
		  if(!pass) res.status(401).send("Incorrect password");
		  const u_id = result.rows[0].u_id;
		  pool.query('SELECT cart_id FROM userbasket WHERE u_id = $1 AND is_active = true', [u_id], (error, results) => {
			if (error) {
				res.status(404).send(err.message);
			} else {
				const cart_id = results.rows[0].cart_id;
				let cookie_val = {
				reg_no: data.userName,
				cart_id: cart_id
				}
				res.cookie('userCookie', cookie_val);
				console.log(res.cookie);
				res.send(cookie_val);
			}
			
		  });
		})
	  }
	})
  });


module.exports = router;
