const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db;

MongoClient.connect('mongodb://localhost:27017/examen', { useNewUrlParser: true }, (err, database) => {
  if (err) return console.log(err)
  db = database.db('examen')
  db.createCollection('inhaal',
	function(err,res){
	  if (err) return console.log(err)
  	})
  app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port 3000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

// Redirect to add
app.get('/', (req, res) => {
   res.redirect('/add')
})

// Show the add "aanvraag" form
app.get('/add', (req, res) => {
   res.render('add.ejs', {})
})

// Add "aanvraag" to the db
app.post('/add', (req, res) => {
  db.collection('inhaal').insertOne(req.body, (err, result) => {
    if (err) return console.log(err)
  })
})

// Show the search form
app.get('/search', (req, res) => {
   res.render('search.ejs', {})
})

// Find a product
app.post('/search', (req, res) => {
 var query = { name: req.body.name }
 db.collection('inhaal').find(query).toArray(function(err, result) {
   if (err) return console.log(err)
   if (result == '')
       res.render('search_not_found.ejs', {})
   else
       res.render('search_result.ejs', { inhaalexamen: result[0] })
 });
})
