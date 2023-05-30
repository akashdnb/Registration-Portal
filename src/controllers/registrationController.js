 const Student = require('../models/studentModel');
 const fs = require('fs');
 const path = require('path');
 var request = require('request');

 const register_student = async(req,res)=>{
    
    try{
        let resume_path = 'https://firebasestorage.googleapis.com/v0/b/indictions2k22.appspot.com/o/'+req.file.filename+'?alt=media';
        const student = new Student({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            registrationNo: req.body.registrationNo,
            phoneNo: req.body.phoneNo,
            email: req.body.email,
            branch: req.body.branch,
            interestedIn: req.body.interestedIn,
            otherTeams: req.body.otherTeams,
            attendedOrientation:req.body.attendedOrientation,
            pi1:'',
            pi2:'',
            resumeShortlist:'',
            testResult:'',
            pi1Panel:'',
            pi2Panel:'',
            resume: resume_path
        })
        const filepath= path.join(__dirname, '../../public/studentResume',req.file.filename);
        var options = {
            'method': 'POST',
            'url': 'https://firebasestorage.googleapis.com/v0/b/indictions2k22.appspot.com/o/'+
               req.file.filename+'?uploadType=media',
            'headers': {
              'Content-Type': 'application/pdf'
            },
            body: fs.createReadStream(filepath)
          };
           var saveStudent= await student.save()
            .then(studentData=>{
                res.render('registration_successful',{
                    message: 'Registration Successful!!',
                    firstName: studentData.firstName,
                    lastName: studentData.lastName,
                    registrationNo: studentData.registrationNo,
                })
            }).catch(error =>{
                res.render('error',{
                    message: error.message});
                //res.send(error.message)
                //console.log(error)
            });

            request(options, function (error, response) {
                if (error){
                    res.render('error',{
                        message: error.message});
                    throw new Error(error);
                }
                //student.resume= response.name+'?alt=media&token='+response.downloadTokens;
                try{
                    const filePath = path.join(__dirname,'../../public/studentResume/', req.file.filename);
                    fs.unlink(filePath, (error)=>{
                        if(error) console.log(error);
                    });
                }catch(error){
                }
                saveStudent;
              });

    } catch(error){
        console.log(error);
        res.render('error',{
            message: error.message});
    }
 }

 // get list of students
 const student_list =async (req,res)=>{
    try{
        if(req.query.pass != process.env.PASSWORD){
            return res.send('Authentication failed!!');
        } 
        var obj = req.query;
        delete obj.pass;
        delete obj.updated;

        resObj={};
        if(req.query.registrationNo && req.query.registrationNo!=='')resObj.registrationNo= req.query.registrationNo;
        else delete obj.registrationNo;
        if(req.query.branch && req.query.branch!=='') resObj.branch= req.query.branch;
        else delete obj.branch
        if(req.query.pi1 && req.query.pi1!=='') resObj.pi1= req.query.pi1;
        else delete obj.pi1
        if(req.query.pi2 && req.query.pi2!=='') resObj.pi2= req.query.pi2;
        else delete obj.pi2
        if(req.query.testResult && req.query.testResult!=='') resObj.testResult= req.query.testResult;
        else delete obj.testResult
        if(req.query.pi1Panel && req.query.pi1Panel!=='') resObj.pi1Panel= req.query.pi1Panel;
        else delete obj.pi1Panel
        if(req.query.pi2Panel && req.query.pi2Panel!=='') resObj.pi2Panel= req.query.pi2Panel;
        else delete obj.pi2Panel

        await Student.find(obj)
        .then((students)=>{
            //res.send(students);
            resObj.data= students;
            if(req.isPrivate === true) res.render('editable_list', resObj)
            else res.render('list', resObj)
        })
        .catch(error=>{
            res.send(error);
        })

    }catch(error){
        res.send(error.message);
    }
 }

 // update route
 const update_student =async (req,res)=>{
    try{
        if(req.body.pass != process.env.PASSWORD){
            return res.send('Authentication failed!!');
        } 
        var obj = req.body;
        delete obj.pass;

        if(obj.pi1!= 'checked') obj.pi1='';
        if(obj.pi2!= 'checked') obj.pi2='';
        if(obj.testResult!= 'checked') obj.testResult='';

        await Student.findOneAndUpdate({_id: req.body._id}, obj)
        .then((updatedStudent)=>{
            return res.render('student',{
                updated:"Data updated successfully"
            });
        })
        .catch(error=>{
            res.send(error);
        })
        
    }catch(error){
        res.send(error.message);
    }
 }

 // Delete route
 const delete_student = async (req,res)=>{
    try{
        if(req.body.pass != process.env.PASSWORD){
            return res.send('Authentication failed!!');
        } 
        const filePath = path.join(__dirname,'../../public/studentResume/', req.body.resume);
        await Student.deleteOne({_id: req.body._id})
        .then(()=>{
            try{
                fs.unlink(filePath, (error)=>{
                    //if(error) console.log(error);
                });
            }catch(error){
                //console.log(error)
            }
            res.send({
                message: 'deleted'
            });
        })
        .catch(error=>{
            res.send(error);
        })

    }catch(error){
        res.send(error.message);
    }
}

//Search student
const search_student =async (req,res)=>{
    try{
        if(req.query.pass != process.env.PASSWORD){
            return res.send('Authentication failed!!');
        } 
        await Student.find(req.body)
        .then((students)=>{
            //res.send(students);
            res.render('list', {
                data: students
            })
        })
        .catch(error=>{
            res.send(error);
        })

    }catch(error){
        res.send(error.message);
    }
 } 

 // student details
 const student_details =async (req,res)=>{
    try{
        if(req.query.pass != process.env.PASSWORD){
            return res.send('Authentication failed!!');
        } 
        await Student.find({registrationNo: req.query.registrationNo})
        .then((students)=>{
           // res.send(students);
           if(req.isPrivate === true){
            res.render('editable_student', {
                data: students
            })
           }else{
            res.render('student', {
                data: students
            })
           }
        })
        .catch(error=>{
            res.send(error);
        })

    }catch(error){
        res.send(error.message);
    }
 } 

 // Show Results
 const results = async (req,res)=>{
    const _id= req.params.id;
    try{
        await Student.find({[_id]: 'checked'})
        .then((students)=>{
            res.render(_id, {
                data: students
            })
        })
        .catch(error=>{
            res.send(error);
        })

    }catch(error){
        res.send(error.message);
    }
 }

 
 module.exports = {
    register_student,
    student_list,
    update_student,
    delete_student,
    search_student,
    student_details,
    results
 }