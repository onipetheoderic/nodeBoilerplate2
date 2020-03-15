import User from '../../models/User/user';
import {encrypt, decrypt, BASEURL, reducer, percentager} from '../../utility/encryptor'
import {redirector, admin_checker_redirector} from '../../utility/redirector'
const fs = require("fs");
import sha512 from 'sha512';

import InspectionType from '../../models/InspectionType/inspectionType';
import InspectionComponent from '../../models/Component/component';
import Datasheet from '../../models/Datasheet/datasheet';
import CompletedComponent from '../../models/CompletedComponent/completedComponent';
import CompletedDatasheet from '../../models/CompletedDatasheet/completedDatasheet';
import Component from '../../models/Component/component';
import Image from '../../models/Image/image';
import DatasheetComponent from '../../models/DatasheetComponent/datasheetComponent';
import Message from '../../models/Message/message';
var parser = require('simple-excel-to-json')
var randomstring = require("randomstring");
var Request = require("request");
const jwt = require('jsonwebtoken');
const encKey = "theoderic onipe";

const splitter = (bearerAuth) =>{
    return bearerAuth.split(" ")[1]
}
const decoder = (token) => {
    var decoded = jwt.verify(token, encKey);
    return decoded.user_id;
}

exports.datasheet_select = function(req, res) {
    // console.log(req.headers['authorization'])
    // console.log(JSON.stringify(req.headers['authorization']));
    const headers = req.headers['authorization']
    console.log("heeeeee", headers)
    if(headers!=undefined){
        const splitted_head = splitter(headers)
        const user_id = decoder(splitted_head)
        // console.log(user_id)
        
    
            const myUrl = `${BASEURL}/get_all_highway_contract_api/${user_id}`
            Request.get({url: myUrl}, (error, response, body) => {
                // console.log("this is the response",response)
                if(error) {
                    return console.log(error);
                }
            
                console.log("this is the parsed Body",body)
                console.log("this is the parsed Body",JSON.parse(body));
                const all_contracts = JSON.parse(body)
                const dataPresence = all_contracts.length === 0 ? false : true;
                console.log(dataPresence.length)
                console.log("this si the data presence",dataPresence)
                res.json(all_contracts)
                //res.json({success:true, all_contracts["all_contracts"]})
                // res.render('Admin/dashboard/datasheet_select', {layout: "layout/assign", data:{contracts:allContracts, dataPresence:dataPresence }})
            });
    }
    else {
        res.status(422);
        res.json({success:false, message:"unauthorized"})
    }
    
    }

const arrReturner = (arr) => {
   if(arr!=undefined){
    return arr.toString()
   }
   else {
       return arr
   }
    
}
exports.create_inspection_data_sheet = function(req, res){
    const headers = req.headers['authorization']
    console.log("heeeeee", headers)
    if(headers!=undefined){
        const splitted_head = splitter(headers)
        const user_id = decoder(splitted_head)
        let contract_id = req.params.id
    
        Datasheet.findOne({contract_id:contract_id}, function(err, datasheet){

            console.log("result off the query", datasheet)
            if(datasheet===null){
                let datasheet = new Datasheet();
                datasheet.name = req.body.name;
                datasheet.contract_id = req.body.contract_id;
                datasheet.highway_inspector_id = user_id
                datasheet.project_type = req.body.contract_type
                datasheet.save(function(err, datasheet_details){       
                    if(err){
                        res.json({success:false, })
                        return;
                    } else { 
                        let newId = datasheet_details._id;
                        Datasheet.findOne({_id: newId}, function(err, datasheet){
                            InspectionType.find({inspectionCategory:datasheet.project_type}, function(err, inspection_types){
                                console.log("this si the datasheet",inspection_types)
                                res.json({datasheets:inspection_types, datasheet_id:datasheet._id, contract_id:datasheet.contract_id})
                            })
                        })
                    }
                });
            //highway_inspector_id
            }
            else {
               
            Datasheet.findOne({contract_id:contract_id}, function(err, existingDatasheet){
                console.log("XXXXXX", existingDatasheet.project_type)                             
                    InspectionType.findOne({inspectionCategory:existingDatasheet.project_type}, function(err, inspection_type){
                        console.log("this si the datasheet",inspection_type)
                        DatasheetComponent.findOne({datasheet_id: existingDatasheet.id}, function(err, datasheetComponent){
                            console.log("this is the datasheet comp", datasheetComponent)
                            if(datasheetComponent===null){
                                Component.find({inspection_type_id: inspection_type}, function(err, components){                      
                                    res.json({datasheets:inspection_type, datasheet_id:datasheet._id, contract_id:datasheet.contract_id, all_component: components})
                                })// //in
                            }
                            else {
                                DatasheetComponent.find({datasheet_id: existingDatasheet.id}, function(err, datasheetComponentAll){
                                console.log("this are all the datasheets", datasheetComponent)
                                let all_records = []
                                for(var i in datasheetComponentAll){
                                    if(datasheetComponentAll[i].component_score){
                                        let newObj = {
                                            highway_inspector_id:arrReturner(datasheetComponentAll[i].highway_inspector_id),
                                            datasheet_id:arrReturner(datasheetComponentAll[i].datasheet_id),
                                            component_score:datasheetComponentAll[i].component_score,
                                            component_name:datasheetComponentAll[i].component_name,
                                            component_id:datasheetComponentAll[i]._id,
                                        }
                                        all_records.push(newObj)
                                    }
                                }
                                res.json(all_records)
                                // res.json({all_component: datasheetComponentAll})
                            })
                            }
                           
                    })
                        
                    })
             
            })
            
            }
        })
    }
    else {
        res.status(422);
        res.json({success:false, message:"unauthorized"})
    }
}

//accepts both datacomponentid as id, and dataComponentValue as score
exports.edit_single_component = function(req, res){
    const headers = req.headers['authorization']
    // console.log("heeeeee", headers)
    if(headers!=undefined){
        const splitted_head = splitter(headers)
        const user_id = decoder(splitted_head)
        DatasheetComponent.findOne({_id:req.body.component_id}, function(err, datasheet){
            const datasheet_id = datasheet.datasheet_id;
            // console.log("this is the db score", datasheet.component_score)
            // console.log("this is the incomming", req.body.component_score)
            if(datasheet.component_score>req.body.component_score){
                res.json({success:false});
            }
            else if(datasheet.component_score<=req.body.component_score) {
                DatasheetComponent.findByIdAndUpdate(req.body.component_id,
                    {component_score:req.body.component_score}).exec(function(err, updated_component){
                    if(err) {
                        console.log(err);
                        
                    } else {
                        // console.log(updated_component)
                        //lets first_of_all get the componentscores by using the datasheet_id
                        Datasheet.findOne({_id:datasheet_id}, function(err, datas){
                            console.log(datas)
                            var contract_id = datas.contract_id;
                            console.log("this is the datassssshhh", contract_id);
                        DatasheetComponent.find({datasheet_id:datasheet_id}, function(err, components){
                            // console.log("all Datasheets componenens", components)
                            var allComponents = []
                            for(var i in components){
                                if(components[i].component_score!=undefined){
                                    allComponents.push(components[i].component_score)
                                }                                
                            }
                            console.log(allComponents);
                            const total = allComponents.reduce(reducer);
                            console.log(total)
                            let myUrl = BASEURL + "/get_contract_percentage/"+contract_id
                            const myUrl2 = `${BASEURL}/modify_percentage_of_highway_contract`
                            Request.get({url: myUrl}, (error, response, body) => {
                                // console.log("this is the response",response)
                                if(error) {
                                    return console.log(error);
                                }       
                                let parsedJSON = JSON.parse(body)
                                let projectLength = parseInt(parsedJSON.data)
    
                                console.log(`these are the count, total, project length ${allComponents.length}, ${total}, ${projectLength}`)
                                let projectPercentage = percentager(allComponents.length, total, projectLength)
    
                               
                                Request.post({
                                    "headers": { "content-type": "application/json" },
                                    "url": myUrl2,
                                    "body": JSON.stringify({
                                        "percentage": projectPercentage,
                                        "contract_id": contract_id
                                    })
                                }, (error, response, body) => {
                                // console.log(error, response, body)
                                if(error) {
                                    console.log(error)
                                }
                                else{
                                    console.log("it was a success")
                                     res.status(200).json({success:true, updated_component}) 
                                }       
    
                                });
                      
                            })
                        });
                        })
                                    
                    }
                });
                
            }
        });
    }
    else {
        res.status(422);
        res.json({success:false, message:"unauthorized"})
    }

}

exports.login_post = function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    if(email==undefined){
        res.status(422);
        res.json({success:false, message:"email is Empty"})
       
    }
    if(password==undefined){
        res.json({success:false, message:"Password Field is empty"})
    }
    User.findOne({email: email}, function(err, user) {
        console.log("its working", user)
       if(user == null)
        {     res.status(403);
           res.json({success:false, message:"Email not registered"})
        }
        else{
            let user_id = user.id
            let user_role = user.userType
            console.log("fff",user_role)
            var token = jwt.sign({user_id: user_id }, encKey);
            if (user.password == password){
                let encId = encrypt(user_id)
                res.status(200);
                res.json({
                    success:true, 
                    message:"Login Successful",
                    role: user_role,
                    user_token: token
                })
            }else{
                res.status(422);
                res.json({success:false, message:"Invalid Password"})
            }
        }

    })
}

//inspection datasheet
