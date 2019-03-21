require('dotenv').config() // Retrieves DB login information from untracked .env file for basic security.
const express    = require('express')
const mysql      = require('mysql')
const app        = express()
const bodyParser = require('body-parser')
const port       = process.argv[2] !== undefined ? process.argv[2] : 3000 // Defaults to port 3000 if none is specified.
// Parse JSON post bodies automatically
app.use(bodyParser.json())
// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});
// Configure class MariaDB connection with environment variables.
let db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "will"
})

app.post('/createUser', (req, res) => {
  // Check if user already exists
  db.query('SELECT * FROM users WHERE userName="' + req.body.userName + '"', (err, result) => {
    
    
    if (!result ) {
      
      let query = 'INSERT INTO users (name, userName, email, password) VALUES ("'+req.body.name+'", "'+req.body.userName+'", "'+req.body.email+'", "'+req.body.password+'");'
      db.query(query, (err, result) => {
        res.send('Done!')
      })


      
      
    } else if (result.length > 0) {
      // Add user to DB
      console.log(result)
      res.send('Account already exists.')
    }
  })
})

// Delete user account
app.get('/deleteAccount/:username', (req, res) => {
  // Check if user already exists
  db.query('DELETE FROM User_Account WHERE Username="'+ req.params.username +'";', (req, res) => {
    res.send('Deleted!')
  })
})
// Start express node web server
app.listen(port, () => {console.log('Server is running on port: ' + port)})