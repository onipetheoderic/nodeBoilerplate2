import User from '../../models/User/user';
import {encrypt, decrypt, BASEURL} from '../../utility/encryptor'
import {redirector, admin_checker_redirector} from '../../utility/redirector'
const fs = require("fs");
import sha512 from 'sha512';

import InspectionType from '../../models/InspectionType/inspectionType';
import InspectionComponent from '../../models/Component/component';
import Datasheet from '../../models/Datasheet/datasheet';
import Component from '../../models/Component/component';
import Image from '../../models/Image/image';
import DatasheetComponent from '../../models/DatasheetComponent/datasheetComponent';
import Message from '../../models/Message/message';
var parser = require('simple-excel-to-json')
var randomstring = require("randomstring");
var Request = require("request");




const excelToJson = require('convert-excel-to-json');
 
var excel2json = require("excel-to-json");

const dashboardMsg = (type, msg) => {
    if(type=="error"){
        return 
    }
    else {
        return
    }
}

exports.register_highway_inspector = function(req, res) {
    res.render('Admin/dashboard/register_highway_inspector', {layout: "layout/register_highway"})
}
//register_highway_inspector_post

exports.register_highway_inspector_post = function(req, res) {
    console.log("registration valuew",req.body)
    const randomPassword = randomstring.generate(7);
    console.log("this is the random password",randomPassword)
    User.findOne({email: req.body.email}, function(err, vals){
        if (vals==null) { 
            console.log("username not taken")
            User.findOne({email: req.body.email}, function(err, valss){
                if (valss==null) { 
                    console.log("Phone number not taken")//
            // var passwordhash = sha512(randomPassword)
            // const passwordhash = md5(passwordhash)
                let user = new User();
                user.email = req.body.email;
                user.firstName = req.body.firstName;
                user.lastName = req.body.lastName;
                user.phoneNumber = req.body.phoneNumber;
                user.gender = req.body.gender;
                user.password = randomPassword;
                user.userType = req.body.userType;
                user.isAdmin = false;
                user.phoneNumber = req.body.phone_number;
                user.save(function(err, auth_details){
                    if(err){
                        res.render('Admin/dashboard/register_highway_inspector', {layout: "layout/register_highway", message:{error: "Error occured during user registration"} })
                        return;
                    } else {
                        res.render('Admin/dashboard/successpage', {layout: false, message:{successMessage: "User Successfully Registered", successDescription: `The Username is ${req.body.email}, while the Password is ${randomPassword}`} })
                    }
                });


        }
        else if(valss !=null){
              // console.log("Phone number taken")
            res.render('Admin/dashboard/register_user', {layout: false, message:{error: "Phone Number has already been taken"} })

        }

        else if(vals !=null){            
            // console.log("username taken")
            res.render('Admin/dashboard/register_user', {layout: false, message:{error: "Email has already been taken"} })
            }
        })
        }
     })   
}

// exports.sendNotification = function(req, res) {
//     var myObject = {
//         TM: 5979,
//         MK: '23979',
//         PZSUX: true
//     };
    
//     senderSocket.writeJSON(myObject).then(function(sendData) {
//         // object has been send
//     }, function (err) {
//         // could not send object
//     });

// }


exports.view_all_contractors = function(req, res) {
    Contractor.find({}).exec(function(err, all_records){
        let allKeys = Object.keys(all_records)
        res.render('Admin/dashboard/view_all_contractors', {layout:false, datas:{contractors:all_records}})
    })
}

//Component


exports.assign_highway_contracts = function(req, res) {
    const myUrl =` ${BASEURL}/all_contracts`
    console.log("rorute hit")
    Request.get({url: myUrl}, (error, response, body) => {
        console.log("this is the response",response)
        if(error) {
            return console.log(error);
        }
        console.log(JSON.parse(body));
        const allContracts = JSON.parse(body)
        User.find({}, function(err, users){
            console.log("all Users", users)
            res.render('Admin/dashboard/assign_highway_contract', {layout: "layout/assign", data:{contracts:allContracts, allHighwayInspectors:users}})
        })
     
    });
}




exports.datasheet_select = function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        const myUrl = `${BASEURL}/user_contract/${decrypted_user_id}`
        Request.get({url: myUrl}, (error, response, body) => {
            // console.log("this is the response",response)
            if(error) {
                return console.log(error);
            }
        
            console.log("this is the parsed Body",body)
            console.log("this is the parsed Body",JSON.parse(body));
            const allContracts = JSON.parse(body)
            const dataPresence = allContracts.length === 0 ? false : true;
            console.log(dataPresence.length)
            console.log("this si the data presence",dataPresence)
            res.render('Admin/dashboard/datasheet_select', {layout: "layout/assign", data:{contracts:allContracts, dataPresence:dataPresence }})
        });
    }
}

exports.datasheet_inspection_type = function(req, res){
    const datasheet_id = req.params.id
    Datasheet.findOne({_id: req.params.id}, function(err, datasheet){
        console.log("this is the detailas of the datasheet", datasheet)
        InspectionType.find({inspectionCategory:datasheet.project_type}, function(err, inspection_types){
            console.log("this si the datasheet",datasheet)
            res.render('Admin/dashboard/datasheet_inspection_type', {layout: "layout/assign", 
            data:{datasheets:inspection_types, datasheet_id:datasheet._id, contract_id:datasheet.contract_id}})
        })
    })
}

exports.create_datasheet_report_post = function(req, res){
    DatasheetComponent.insertMany(req.body, function (err, docs) {
        if (err){
            return console.error(err);
            res.status(400).json(err);
        } else {       
          res.status(200).json(docs);
        }
    });
}



exports.view_inspections = function(req, res){
    res.render('Admin/dashboard/view_inspections', {layout: "layout/admin3"})
}

exports.message_inspector_get = function(req, res){
    console.log("from the message ",req.session)
    if(!req.session.hasOwnProperty("user_id")){
        console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        User.findOne({_id:decrypted_user_id}, function(err, user){
            if(user.userType === "siteEngineer"){
                Message.find({recieverId:decrypted_user_id}, function(err, msgs){

                    Message.find({senderId:decrypted_user_id}, function(err, sentMsgs){
                        let sentMsgCount = sentMsgs.length
                    console.log(msgs)
                    let msgCount = msgs.length
                        User.find({userType:"director"}, function(err, directors){
                            console.log("from the directors", directors)
                            res.render('Admin/dashboard/message_inspector_get', {layout: "layout/admin3", data:{engineers:directors, sentMsgCount:sentMsgCount, inboxCount:msgCount}})
                        })
                    })
                })
            }
            else{
                Message.find({recieverId:decrypted_user_id}, function(err, msgs){

                    Message.find({senderId:decrypted_user_id}, function(err, sentMsgs){
                        let sentMsgCount = sentMsgs.length
                    console.log(msgs)
                    let msgCount = msgs.length
                    User.find({userType:"siteEngineer"}, function(err, engineers){
                        console.log("from the directors", engineers)
                        res.render('Admin/dashboard/message_inspector_get', {layout: "layout/admin3", data:{engineers:engineers, sentMsgCount:sentMsgCount, inboxCount:msgCount}})
                    })
                    })
                })
            }
        })
    }
}


/*
 senderId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    recieverId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    message: String,
    notificationSeen: {type:Boolean, default:false},
    read: {type:Boolean, default:false}
*/ 
exports.message_inspector_post = function(req, res){
    if(!req.session.hasOwnProperty("user_id")){
        console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
    let decrypted_user_id = decrypt(req.session.user_id, req, res)
    let message = new Message();
    message.senderId = decrypted_user_id;
    message.recieverId = req.body.recieverId;
    message.subject = req.body.subject;
    message.message = req.body.message;
    message.save(function(err, auth_details){
        if(err){
            console.log(err)
        }
        else {
            res.render('Admin/dashboard/successpage', {layout: false, message:{successMessage: `Message Successfully Sent`, successDescription: `Message has been successfully sent to the Highway Official`} })
        }
    });
}
}

exports.view_sent_messages_get = function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
    let decrypted_user_id = decrypt(req.session.user_id, req, res)
    Message.find({recieverId:decrypted_user_id}, function(err, msgs){
        let msgCount = msgs.length
    Message.find({senderId:decrypted_user_id}, function(err, sentMsgs){
        res.render('Admin/dashboard/view_messages', {layout: "layout/admin3", data:{sentMsgs:sentMsgs, sentMsgCount:sentMsgs.length, inboxCount:msgCount}})
    })
})
    }
}

exports.view_recieved_messages_get = function(req, res) {
    if(!req.session.hasOwnProperty("user_id")){
        console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
    let decrypted_user_id = decrypt(req.session.user_id, req, res)
    Message.find({recieverId:decrypted_user_id}, function(err, msgs){
        let msgCount = msgs.length
    Message.find({senderId:decrypted_user_id}, function(err, sentMsgs){
        res.render('Admin/dashboard/view_recieved_messages_get', {layout: "layout/admin3", data:{sentMsgs:sentMsgs, recievedMsgs:msgs, sentMsgCount:sentMsgs.length, inboxCount:msgCount}})
    })
})
    }
}
exports.read_messages_get = function(req, res){
    if(!req.session.hasOwnProperty("user_id")){
        console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
    let decrypted_user_id = decrypt(req.session.user_id, req, res)
    Message.find({recieverId:decrypted_user_id}, function(err, msgs){
        let msgCount = msgs.length
    Message.find({senderId:decrypted_user_id}, function(err, sentMsgs){
    Message.findOne({_id:req.params.id}, function(err, msg){
        res.render('Admin/dashboard/read_message', {layout: "layout/admin3", data:{msg:msg, sentMsgCount:sentMsgs.length, inboxCount:msgCount}})
    })
})
    });
}
}
exports.edit_datasheet_report_post = function(req, res){
    console.log("this is the body of the Ajax call",req.body)
    console.log("single document", req.body[0].datasheet_id)
   
    DatasheetComponent.deleteMany({datasheet_id: req.body[0].datasheet_id}, function (err) {
        if(err){
             res.status(200).json(docs);
        }
        else {
            DatasheetComponent.insertMany(req.body, function (err, docs) {
                if (err){
                    return console.error(err);
                    res.status(400).json(err);
                } else {       
                  res.status(200).json(docs);
                }
            });
        }
      
    
})
}



exports.inspection_report = function(req, res){
    console.log("route reached", req.params.id)
    if(!req.session.hasOwnProperty("user_id")){
        console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
    let decrypted_user_id = decrypt(req.session.user_id, req, res)
    let inpsection_type = req.params.id;
    let datasheet_id = req.params.datasheet_id
    console.log(datasheet_id)
    // we get all component that belongs to the inspection type
    DatasheetComponent.findOne({datasheet_id: datasheet_id}, function(err, datasheetComponent){
        
            if(datasheetComponent===null){
                Component.find({inspection_type_id: inpsection_type}, function(err, components){
               
                res.render('Admin/dashboard/inspection_report', {layout: "layout/admin3", data:{all_component: components, highway_inspector_id:decrypted_user_id, datasheet_id:datasheet_id}})
            })// //in
            }
            else {
                DatasheetComponent.find({datasheet_id: datasheet_id}, function(err, datasheetComponentAll){
                console.log("this are all the datasheets", datasheetComponent)
                res.render('Admin/dashboard/edit_component_report', {layout: "layout/admin3", data:{all_component: datasheetComponentAll, highway_inspector_id:decrypted_user_id, datasheet_id:datasheet_id}})
            })
            }
           
    })
}

}



exports.create_inspection_data_sheet = function(req, res){
    if(!req.session.hasOwnProperty("user_id")){
        console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
    console.log("this is the user session",req.session)
    let decrypted_user_id = decrypt(req.session.user_id, req, res)
    Datasheet.findOne({contract_id:req.body.contract_id}, function(err, datasheet){

        console.log("result off the query", datasheet)
        if(datasheet===null){
            console.log("++++++++++++++++++No datasheet is existing creating a new one")
                let datasheet = new Datasheet();
                datasheet.name = req.body.name;
                datasheet.contract_id = req.body.contract_id;
                datasheet.highway_inspector_id = decrypted_user_id
                datasheet.project_type = req.body.contract_type
                datasheet.save(function(err, datasheet_details){       
                    if(err){
                       res.redirect("/datasheet_select")
                        return;
                    } else { 
                       //we get everything that is related to the bridge by searching the component db
                       res.redirect('/datasheet_inspection_type/'+ datasheet_details._id)
                    }
                });
          //highway_inspector_id
        }
        else {
            Datasheet.findOne({contract_id:req.body.contract_id}, function(err, existingDatasheet){
                console.log("++++++++++++++++++++++++Already esisting datashit")
                res.redirect('/datasheet_inspection_type/'+ existingDatasheet._id)
            })
            
        }
    })
}
}

exports.get_contract_datas = function(req, res) {
    delete res._headers['set-cookie'];
    console.log("this si the request", req)
    //this method is to use the contract id to get the dataset
    Datasheet.findOne({contract_id: req.params.contract_id}, function(err, datasheet){       
        if(datasheet!=null){
        DatasheetComponent.find({datasheet_id: datasheet._id})
        .populate({path:'highway_inspector_id', select: '-password -isSuperAdmin'})
        .populate('datasheet_id').
        exec(function (err, story) {          
            res.json({datas:story})
          });
        
        }
        else{
            res.json({datas:"null"})
        }
     

    })
}

exports.modify_highway_contract_percentage = function(req, res){
  
    let decrypted_user_id = decrypt(req.session.user_id, req, res)
    //sends a post request, with the user id as a parameter and gets all the contract he is managign
    const myUrl = `${BASEURL}/user_contract/${decrypted_user_id}`
    Request.get({url: myUrl}, (error, response, body) => {
        // console.log("this is the response",response)
        if(error) {
            return console.log(error);
        }
        console.log(body)
        const allContracts = JSON.parse(body)
        console.log("allContracts", allContracts)
        res.render('Admin/dashboard/modify_highway_contract_percentage', {layout: "layout/assign", data:{contracts:allContracts}})
    });

}


exports.modify_highway_contract_percentage_post = function(req, res){
    
    const myUrl = `${BASEURL}/modify_percentage_of_highway_contract`
    let decrypted_user_id = decrypt(req.session.user_id, req, res)
    console.log("this is the decrypted user_id",decrypted_user_id)
    console.log("this is the parameters sent", req.body)
    let currentPercentage = req.body.percentage;
    let contract_id = req.body.contract_id;
    Request.post({
        "headers": { "content-type": "application/json" },
        "url": myUrl,
        "body": JSON.stringify({
            "percentage": currentPercentage,
            "contract_id": contract_id
        })
    }, (error, response, body) => {
        // console.log(error, response, body)
        if(error) {
           console.log(error)
        }
        else{
            console.log(JSON.parse(body));
            let data = JSON.parse(body)
            res.render('Admin/dashboard/successpage', {layout: false, message:{successMessage: `${data.data.projectTitle} Percentage has been upgraded`, successDescription: `${data.data.projectTitle} has been Upgraded to ${data.data.currentPercentage}`} })
            
        }        

    });

}


exports.assign_highway_contracts_post = function(req, res) {
   
    console.log("this are the request",req.body)
    const myUrl = `${BASEURL}/assign_highway_to_contract`
    let userDetail = req.body.user.split(",")
    let userId = userDetail[0]
    let inspectorFullname = `${userDetail[1]} ${userDetail[2]}`
    
    Request.post({
        "headers": { "content-type": "application/json" },
        "url": myUrl,
        "body": JSON.stringify({
            "user_id": userId,
            "contract_id": req.body.contract
        })
    }, (error, response, body) => {
        // console.log(error, response, body)
        if(error) {
           console.log(error)
        }
        else{
            console.log(JSON.parse(body));
            let data = JSON.parse(body)
            res.render('Admin/dashboard/successpage', {layout: false, message:{successMessage: `${data.data.projectTitle} has been Assigned`, successDescription: `${data.data.projectTitle} has been Assigned to ${inspectorFullname}`} })
            
        }        

    });
    
    //assign_highway_to_contract
   
}
// InspectionType

exports.login = function(req, res) {
    res.render('Admin/dashboard/login-register', {layout: "layout/login-register", })
}




exports.login_post = function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    console.log("the email", email, password)
    // let passwordhash = sha512(req.body.password)
    User.findOne({email: email}, function(err, user) {
        console.log("its working", user)
       if(user == null)
        {
           res.render('Admin/dashboard/login-register', {layout: "layout/login-register", message:{error: "Email not registered"}})
        }
        else{
            let user_id = user.id
            if (user.password == password){
                  // console.log('User connected');
                let encId = encrypt(user_id)
                console.log("this is the encId", encId)
                req.session.user_id = encId;
                console.log(req.session)
                // res.render('Admin/dashboard/index', {layout: "layout/admin3"})
                res.redirect("/")
            }else{
                  // res.status(401).send('Invalid Password Key');
                  res.render('Admin/dashboard/login-register', {layout: "layout/login-register", message:{error: "invalid Email or password"}})
            }
        }

    })
}


exports.logout = function(req, res){
  req.session.destroy();  
   res.redirect('/')                
}

exports.upload_multiple_inspection_datasheet_get = function(req, res){
    res.render('Admin/dashboard/upload_multiple_inspection_datasheet', {layout: "layout/admin3"})
}


exports.upload_images_to_datasheet = function(req, res){
    if(!req.session.hasOwnProperty("user_id")){
        console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
    let decrypted_user_id = decrypt(req.session.user_id, req, res)
    Datasheet.find({highway_inspector_id:decrypted_user_id}, function(err, datasheets){
        res.render('Admin/dashboard/upload_multiple_images_inspection_datasheet', {layout: "layout/admin3", data:{datasheets:datasheets}})
    })
}
  
}
//Upload supporting images for inspections



const filePlacerAndNamer = (req, res, the_file) => {
    // let file_name = the_file.name
    let file_name = Date.now()+ the_file.name;
    
    the_file.mv('views/public/uploads/' + file_name, function(err) {
   });
    return file_name
}
/* highway_inspector_id: {type:String, required: true},
    datasheet_id: [{ type: Schema.Types.ObjectId, ref: 'Datasheet' }],
    images: {type:String, required: true},*/
var myArray = []
var myId = []
exports.upload_images_to_datasheet_post = function(req, res){
    console.log("the body of the file", req.body.datasheet_id)
    myId.push(req.body.datasheet_id)
    let incoming_file_name = filePlacerAndNamer(req, res, req.files.file);
    myArray.push(incoming_file_name)
    console.log("this are the files", incoming_file_name, myArray)
}

exports.upload_to_datasheet_post = function(req, res){
    console.log("alllllllllll", req)
    Datasheet.findByIdAndUpdate(req.body.datasheet_id,
        {images:myArray}).exec(function(err, updated_staff){
            if(err) {
               console.log(err);
               
            } else {
                console.log(updated_staff)
            let image = new Image()
            image.datasheet_id =req.body.datasheet_id;
            image.images = myArray;
            image.save(function(err, auth_details){       
                if(err){
                   console.log("Not saved")
                } else {                    
                    res.redirect('/')
                }
            });
        }
    });

}



exports.upload_multiple_inspection_datasheet_post = function(req, res){
    
     console.log(req.files.file)
    // dropzone queries it multiple times, that is its auto submit
    // var files = [].concat(req.files.data);
    // console.log("this are the files", files);


    var doc = parser.parseXls2Json(req.files.file.data); 
    console.log("this is the uploaded doc", doc)
    let incoming_file_name = filePlacerAndNamer(req, res, req.files.file);
    console.log(incoming_file_name)

}


exports.logout = function(req, res){
    req.session.destroy();  
     res.redirect('/login')                
  
  }
  
exports.all_highway_inspectors = function(req, res){
    User.find({userType:"siteEngineer"}, function(err, engineers){
        res.render('Admin/dashboard/all_highway_inspectors', {layout: "layout/data_layout", data:{engineers:engineers} })
    })
}

exports.changePassword_get = function(req, res){
    if(!req.session.hasOwnProperty("user_id")){
        console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        res.render('Admin/dashboard/change_password', {layout: "layout/login-register"})
    }
    
}




exports.changePassword_post = function(req, res){
   const previousPassword = req.body.previous_password;
   const newPassword = req.body.new_password;

    if(!req.session.hasOwnProperty("user_id")){
        console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        User.findOne({_id:decrypted_user_id}, function(err, user){           
            if(user.password === previousPassword){
                User.findByIdAndUpdate(decrypted_user_id, {password:newPassword})
                .exec(function(err, updated_staff){
                    if(err){
                        console.log(err)
                    }else {
                        res.redirect('/login')
                    }
                })
                
            }
            else {
                res.render('Admin/dashboard/change_password', {layout: "layout/login-register", message:{error:'You Entered the Wrong Password'}})
            }
        })
    }


    
}



exports.register_post = function(req, res) {
    console.log("registerpost url", req.body)
    
    const randomPassword = randomstring.generate(7);
    console.log("this is the random password",randomPassword)
    User.findOne({email: req.body.email}, function(err, vals){
        if (vals==null) { 
            console.log("username not taken")
            User.findOne({email: req.body.email}, function(err, valss){
                if (valss==null) { 
                    console.log("Phone number not taken")//
            // var passwordhash = sha512(randomPassword)
            // const passwordhash = md5(passwordhash)
            let user = new User();
                user.email = req.body.email;
                user.firstName = req.body.first_name;
                user.lastName = req.body.last_name;
                user.phoneNumber = req.body.phoneNumber;
                user.gender = req.body.gender;
                user.password = req.body.password;
                user.userType = "superAdmin";
                user.isAdmin = false;   
                user.phoneNumber = req.body.phone_number;     
                user.save(function(err, auth_details){       
                    if(err){
                        res.render('Admin/dashboard/login-register', {layout: "layout/login-register", message:{error: "Error occured during user registration"} })
                        return;
                    } else {                    
                        res.render('Admin/dashboard/successpage', {layout: false, message:{successMessage: "User Successfully Registered", successDescription: `The Username is ${req.body.email}, while the Password is ${randomPassword}`} })
                    }
                });


        }
        else if(valss !=null){
              // console.log("Phone number taken")
            res.render('Admin/dashboard/login-register', {layout: "layout/login-register", message:{error: "Phone Number has already been taken"} })

        }

      
        }) 
        }
        else if(vals !=null){            
            // console.log("username taken")
            res.render('Admin/dashboard/login-register', {layout: "layout/login-register", message:{error: "Email has already been taken"} })
            }
     })   

}
// Ij3Yg9i


