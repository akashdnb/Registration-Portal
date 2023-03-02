 const Student = require('../models/studentModel');
 const fs = require('fs');
 const path = require('path');

 const register_student = async(req,res)=>{
   
    try{
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
            resume: req.file.filename
        })

            await student.save()
            .then(studentData=>{
                res.status(200).send({
                    message: "Registered successfully!",
                    data: {
                        firstName: studentData.firstName,
                        lastName: studentData.lastName
                    }           
                })
            }).catch(error =>{
                res.send(error.message)
            });
        

    } catch(error){
        console.log(error);
        res.status(400).send(error.message);
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
            res.render('list', resObj)
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

        if(obj.pi1== undefined) obj.pi1='';
        if(obj.p21== undefined) obj.pi2='';
        if(obj.testResult== undefined) obj.testResult='';

        await Student.findOneAndUpdate({_id: req.body._id}, obj)
        .then((updatedStudent)=>{
            //res.set('updated', 'Updated successfully');
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
                    if(error) console.log(error);
                });
            }catch(error){
                console.log(error)
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
            res.render('student', {
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
    student_details
 }