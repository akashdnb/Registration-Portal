const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const hbs = require('hbs')
const cron = require('node-cron');
const request = require('request');
require('dotenv').config()
require('../src/db/conn')
const studentRoute = require('./routers/studentRoute');
const { enable } = require('./routers/studentRoute');
app.use(express.static(path.resolve('./public')));

const port= process.env.PORT || 3000;
//app.set('views', path.join(__dirname))
app.set('view engine', 'hbs');

hbs.registerHelper('incrementIndex', (index) => index + 1);

app.use('/', studentRoute);

app.get('/', (req, res)=>{
  res.redirect('/register');
})

app.get('/register', (req, res)=>{

  const registrationDeadline = new Date(process.env.REGISTRATION_DEADLINE);
  const currentTime = new Date();

  if (currentTime > registrationDeadline) {
      res.render('registration_closed', {
          message: 'Registration is closed.'
      });
      return;
  }
  res.render('register')
})

app.get('/test', (req, res)=>{
  res.send('hello from drt!');
})

cron.schedule('*/14 * * * *', () => {
  //console.log('running a task every 14 minutes');
  try {
    request.get('https://inductions2022.onrender.com/test', (error, response, body)=>{
      console.log(body);
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, ()=>{
    console.log(`Listining to port: ${port}`);
});


//https://inductions2022.onrender.com/