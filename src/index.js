const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const hbs = require('hbs')
require('dotenv').config()
require('../src/db/conn')
const studentRoute = require('./routers/studentRoute');
const { enable } = require('./routers/studentRoute');
app.use(express.static(path.resolve('./public')));

const port= process.env.PORT || 3000;
//app.set('views', path.join(__dirname))
app.set('view engine', 'hbs');

app.use('/', studentRoute);

app.get('/', (req, res)=>{
  res.render('index')
})

app.get('/register', (req, res)=>{
  res.render('register')
})

app.get('/test', (req, res)=>{
  res.send('hello from drt!');
})

app.listen(port, ()=>{
    console.log(`Listining to port: ${port}`);
});


//https://inductions2022.onrender.com/