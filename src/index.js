const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const hbs = require('hbs')
require('dotenv').config()
require('../src/db/conn')
const studentRoute = require('./routers/studentRoute');
app.use(express.static(path.resolve('./assets')));

const port= process.env.PORT || 3000;
//app.set('views', path.join(__dirname))
app.set('view engine', 'hbs');

app.use('/', studentRoute);

app.get('/', (req, res)=>{
  res.render('index')
})

app.get('/display', (req, res)=>{
  res.render('display')
})

app.get('/resume', (req,res)=>{
  const filepath= path.join(__dirname, '../public/studentResume',req.query.path);
  var data =fs.readFileSync(filepath);
  res.contentType("application/pdf");
  res.send(data);
})

app.get('/register', (req, res)=>{
  res.render('register')
})

app.listen(port, ()=>{
    console.log(`Listining to port: ${port}`);
});