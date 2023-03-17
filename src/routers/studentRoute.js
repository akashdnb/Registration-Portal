const express = require('express');
const route = express();
const multer = require('multer');
const path= require('path');
const maxSize = (1024*1024)/4;

route.use(express.json());
route.use(express.urlencoded({
  extended: true
}));
route.use(express.static('public'));

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, path.join(__dirname, '../../public/studentResume'), (error, success)=>{
            if(error) throw error;
        });
    },
    filename: (req, file, cb)=>{
        const name = req.body.registrationNo+'-'+ Date.now()+ '.pdf';
        cb(null, name, (error, success)=>{
            if(error) throw error;
        })
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize }
});

const registrationController = require('../controllers/registrationController');

route.post('/register', upload.single('application/pdf'), registrationController.register_student);
route.get('/list',  registrationController.student_list);
route.post('/update', registrationController.update_student);
route.post('/delete', registrationController.delete_student);
route.get('/search', registrationController.search_student);
route.get('/student', registrationController.student_details);
route.get('/results/:id', registrationController.results);

module.exports = route;