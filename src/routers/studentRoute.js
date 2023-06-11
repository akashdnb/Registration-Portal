const express = require('express');
const route = express();
const multer = require('multer');
const path= require('path');
const maxSize = (1024*1024)*3;

route.use(express.json());
route.use(express.urlencoded({
  extended: true
}));
route.use(express.static('public'));

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, path.join(__dirname, '../../public/studentResume'), (error, success)=>{
            if(error) res.render('error', {
                message: error.message
            })
        });
    },
    filename: (req, file, cb)=>{
        const name = req.body.registrationNo+'-'+ Date.now()+ '.pdf';
        cb(null, name, (error, success)=>{
            if(error) res.render('error', {
                message: error.message
            })
        })
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize }
});

// Middleware function to set the boolean value for private access
function setBooleanValue(isPrivate) {
    return (req, res, next)=>{
      req.isPrivate = isPrivate; 
      next();
    };
  }

const registrationController = require('../controllers/registrationController');

route.post('/register', upload.single('application/pdf'), registrationController.register_student);
route.get('/list', setBooleanValue(false),  registrationController.student_list);
route.post('/update', registrationController.update_student);
route.post('/delete', registrationController.delete_student);
route.get('/search', registrationController.search_student);
route.get('/student', setBooleanValue(false), registrationController.student_details);
route.get('/results/:id', registrationController.results);

//private editable requests
route.get('/editable_list', setBooleanValue(true),  registrationController.student_list);
route.get('/editable_student', setBooleanValue(true), registrationController.student_details);

module.exports = route;