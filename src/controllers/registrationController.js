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

        const checkStudentData = await Student.findOne({firstName:"0000"});
        if(checkStudentData){
            res.status(200).send("already registered!");
        }else{
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
                console.log(error);
                res.send("semething went wrong")
            });
        }

    } catch(error){
        console.log(error);
        res.status(400).send(error.message);
    }
 }

 const student_list =async (req,res)=>{
    try{
        if(req.query.pass != process.env.PASSWORD){
            return res.send('Authentication failed!!');
        } 
        var obj = req.query;
        delete obj.pass;
        await Student.find(obj)
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

 // update route
 const update_student =async (req,res)=>{
    try{
        if(req.query.pass != process.env.PASSWORD){
            return res.send('Authentication failed!!');
        } 
        var obj = req.query;
        delete obj.pass;

        await Student.findOneAndUpdate({registrationNo: req.query.registrationNo}, obj)
        .then((updatedStudent)=>{
            res.status(200).send({
                message: 'updated',
                data: obj
            })
        })
        .catch((error)=>{
            res.status(400).send({
                message: 'failed',
                data: error
            })
        })
    }catch(error){
        res.send(error.message);
    }
 }

 // Delete route
 const delete_student = async (req,res)=>{
    try{
        if(req.query.pass != process.env.PASSWORD){
            return res.send('Authentication failed!!'); 
        } 
        const filePath = path.join(__dirname,'../../public/studentResume/', req.query.resume);
        await Student.deleteOne({_id: req.query._id})
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
 
 module.exports = {
    register_student,
    student_list,
    update_student,
    delete_student,
    search_student
 }