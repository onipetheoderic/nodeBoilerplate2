import User from '../../models/User/user';
import {encrypt, decrypt, BASEURL} from '../../utility/encryptor'
import {redirector, admin_checker_redirector} from '../../utility/redirector'
const fs = require("fs");
import sha512 from 'sha512';

import InspectionType from '../../models/InspectionType/inspectionType';
import InspectionComponent from '../../models/Component/component';
import Datasheet from '../../models/Datasheet/datasheet';
import Component from '../../models/Component/component';
import DatasheetComponent from '../../models/DatasheetComponent/datasheetComponent';

var randomstring = require("randomstring");
var Request = require("request");

const filePlacerAndNamer = (req, res, the_file) => {
    // let file_name = the_file.name
    let file_name = Date.now()+ the_file.name
    the_file.mv('views/public/uploads/' + file_name, function(err) {
   });
    return file_name
}

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

/*
import {encrypt, decrypt} from '../../utility/encryptor'

exports.default_dashboard = function(req, res){
    if(req.session.user_id){ 
        let decrypted_user_id = decrypt(req.session.user_id)
        User.findOne({_id: decrypted_user_id}, function(err, user) {
          if(user.isAdmin == true){
            res.redirect('/admin/admin_dashboard')
          }
          else {
            res.redirect('/admin/client_dashboard')
          }
        })
    }
    else {
        res.render('sportsteam/login')
    }
}
*/ 
exports.datasheet_select = function(req, res) {
    redirector(req, res)
    let decrypted_user_id = decrypt(req.session.user_id)
    const myUrl = `${BASEURL}/user_contract/${decrypted_user_id}`
    Request.get({url: myUrl}, (error, response, body) => {
        // console.log("this is the response",response)
        if(error) {
            return console.log(error);
        }
        console.log(body)
        console.log(JSON.parse(body));
        const allContracts = JSON.parse(body)
       
        res.render('Admin/dashboard/datasheet_select', {layout: "layout/assign", data:{contracts:allContracts}})
    });
}
/*
  name: {type:String, required: true},
    contract_id: String,
    highway_inspector_id: String,
*/ 
//create_inspection_data_sheet

exports.datasheet_inspection_type = function(req, res){
    const datasheet_id = req.params.id
    console.log("this is the datasheet_id", req.params.id)
    /*InspectionTypeSchema = new mongoose.Schema({
    name: {type:String, required: true},
    inspectionCategory: String,*/ 
    Datasheet.findOne({_id: req.params.id}, function(err, datasheet){
        InspectionType.find({inspectionCategory:datasheet.project_type}, function(err, inspection_types){
            res.render('Admin/dashboard/datasheet_inspection_type', {layout: "layout/assign", data:{datasheets:inspection_types}})
        })
    })
}

exports.inspection_report = function(req, res){
    let inpsection_type = req.params.id;
    // we get all component that belongs to the inspection type
    Component.find({inspection_type_id: inpsection_type}, function(err, components){
        //Now we have gotten the components, lets populate the forms with it
    })
//inspection_type_id
    
}



exports.create_inspection_data_sheet = function(req, res){
    redirector(req, res)
    console.log("this is the user session",req.session)
    let decrypted_user_id = decrypt(req.session.user_id)
    Datasheet.findOne({contract_id:req.body.contract_id}, function(err, datasheet){
        console.log("result off the query", datasheet)
        if(datasheet===null){
        /*
          name: {type:String, required: true},
    contract_id: String,
    highway_inspector_id: String,
    project_type: String,
        */    
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
            /*
             let user = new User();
                user.email = req.body.email;
                user.firstName = req.body.firstName;
                user.lastName = req.body.lastName;
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

            */
        }
        else {
            res.render('Admin/dashboard/datasheet_select', {layout: "layout/assign", data:{error:"Datasheet already exists for the user"}})
        }
    })
}


exports.modify_highway_contract_percentage = function(req, res){
    redirector(req, res)
    console.log("this is the user session",req.session)
    let decrypted_user_id = decrypt(req.session.user_id)
    //sends a post request, with the user id as a parameter and gets all the contract he is managign
    const myUrl = `${BASEURL}/user_contract/${decrypted_user_id}`
    Request.get({url: myUrl}, (error, response, body) => {
        // console.log("this is the response",response)
        if(error) {
            return console.log(error);
        }
        console.log(body)
        console.log(JSON.parse(body));
        const allContracts = JSON.parse(body)
        res.render('Admin/dashboard/modify_highway_contract_percentage', {layout: "layout/assign", data:{contracts:allContracts}})
    });

    /* we firstly get the current percentage of the contract*/ 
}
exports.modify_highway_contract_percentage_post = function(req, res){
    redirector(req, res)
    const myUrl = `${BASEURL}/modify_percentage_of_highway_contract`
    let decrypted_user_id = decrypt(req.session.user_id)
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
    redirector(req, res)
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
                user.password = randomPassword;
                user.userType = req.body.user_type;
                user.isAdmin = false;   
                user.phoneNumber = req.body.phone_number;     
                user.save(function(err, auth_details){       
                    if(err){
                        res.render('Admin/dashboard/register_user', {layout: "layout/admin", message:{error: "Error occured during user registration"} })
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



