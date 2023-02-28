const express = require('express');
const { statSync } = require('fs');
const studentModel = require('./models/studentModel.js');
const app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
// const path = require("path");
// const hbs = require("hbs");
const port= process.env.PORT || 3000;
require('./db/conn.js');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

// const public_path = path.join(__dirname, "../public");
// const templates_path = path.join(__dirname, "../templates/views");
// const partials_path = path.join(__dirname, "../templates/partials");
// app.use(express.static(templates_path))
// app.use(express.static(public_path))
// app.set("view engine", "hbs");
// app.set("views", templates_path);
// hbs.registerPartials(partials_path);



app.get('/',(req,res)=>{
    res.send("hii")
});




app.post('/register', upload.single('resume'), (req, res, next) => {
 
    var obj = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        registrationNo: req.body.registrationNo,
        phoneNo: req.body.phoneNo,
        email: req.body.email,
        pi1Cleared: "false",
        pi2Cleared:"false",
        resume: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }

    studentModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.send("saved");
        }
    });
});





app.post('/uploadResume', upload.any, (req, res, next) => {
    var obj = {
            pdf: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
    }
    //res.render(req.file.fieldname);
});

app.listen(port, ()=>{
    console.log(`Listining to port: ${port}`);
});