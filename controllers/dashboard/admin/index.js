import {encrypt, decrypt, BASEURL} from '../../../utility/encryptor'
import {redirector, admin_checker_redirector} from '../../../utility/redirector'
const fs = require("fs");
import InspectionType from '../../../models/InspectionType/inspectionType';
import Component from '../../../models/Component/component';
import User from '../../../models/User/user';
// TypeError: (0 , _index.AlexanderTheGreat) is not a function
var randomstring = require("randomstring");
var Request = require("request");



const filePlacerAndNamer = (req, res, the_file) => {
    // let file_name = the_file.name
    let file_name = Date.now()+ the_file.name
    the_file.mv('views/public/uploads/' + file_name, function(err) {
   });
    return file_name
}

exports.home = function(req, res) {
    
    if(!req.session.hasOwnProperty("user_id")){
        console.log("its working", req.session.user_id)
        res.redirect('/login')
    }
    else if(req.session.hasOwnProperty("user_id")){
        let decrypted_user_id = decrypt(req.session.user_id, req, res)
        console.log("this is the decrypted user", decrypted_user_id)
        User.findOne({_id:decrypted_user_id}, function(err, user){
            console.log(user.userType)
            const superAdmin = user.userType ==="superAdmin"?true:false;
            const siteEngineer = user.userType==="siteEngineer"?true:false;
            const permanentSecretary = user.userType ==="permanentSecretary"?true:false;
            const minister = user.userType === "minister"?true:false;
            const director = user.userType === "director"?true:false;
            if(superAdmin){
                res.render('Admin/dashboard/index_superadmin', {layout: "layout/admin3", user:user, name:user.firstName})
            }
            else if(siteEngineer){
                res.render('Admin/dashboard/index_site_engineer', {layout: "layout/admin3", user:user, name:user.firstName})
            }
            else if(permanentSecretary){
                res.render('Admin/dashboard/index_permanent_secretary', {layout: "layout/admin3", user:user, name:user.firstName})
            }
            else if(minister){
                res.render('Admin/dashboard/index_minister', {layout: "layout/admin3", user:user, name:user.firstName})
            }
            else if(director){
                res.render('Admin/dashboard/index_director', {layout: "layout/admin3", user:user, name:user.firstName})
            }
          
        })
    }

   
}
exports.login = function(req, res) {
    
    console.log("this is the session",req.session)
    res.render('Admin/dashboard/login-register', {layout: "layout/login-register" })
}
exports.register = function(req, res) {
    res.render('Admin/dashboard/login-register', {layout: "layout/login-register"})
}
exports.all_inspections = function(req, res) {
    res.render('Admin/dashboard/all_inspections', {layout: "layout/data_layout"})
}
exports.inspection_page = function(req, res) {
    res.render('Admin/dashboard/inspection_page', {layout: "layout/admin3"})
}
exports.datasheet_inspection_type = function(req, res) {
    res.render('Admin/dashboard/datasheet_inspection_type', {layout:"layout/admin3"})
}

/*
router.route('/create_inspection_type')
    .get(AdminDashboardController.create_inspection_type)

router.route('/create_inspection_component')
    .get(AdminDashboardController.create_inspection_component)

router.route('/create_inspection_datasheet')
    .get(AdminDashboardController.create_inspection_datasheet)
*/ 
exports.create_inspection_type_get = function(req, res) {

    res.render('Admin/dashboard/create_inspection_type', {layout: "layout/admin3", data:{category:req.params.id}})
}


/*
router.route('/success_type')
    .get(AdminDashboardController.success_type)

router.route('/success_component')
    .get(AdminDashboardController.success_component)
*/

exports.success_type = function(req, res) {
    res.render('Admin/dashboard/success_type', {layout: "layout/admin3"})
}

exports.success_component = function(req, res) {
    res.render('Admin/dashboard/success_component', {layout: "layout/admin3"})
}
exports.create_inpsector_type_post = function(req, res){
    console.log("this is the ajax bobdy",req.body)
    InspectionType.insertMany(req.body, function (err, docs) {
      if (err){
          return console.error(err);
          res.status(400).json(err);
      } else {       
        res.status(200).json(docs);
      }
    });
}

//inspection_type_id
exports.create_inspection_component = function(req, res) {
    InspectionType.find({}, function(err, types){
        console.log("this are the types", types)
        res.render('Admin/dashboard/create_inspection_component', {layout: "layout/admin3", data:{inspection_type: types, mainType:req.params.id}})
    })   
}

//component_parent
//inspection_type
exports.create_component_type_post = function(req, res){
    console.log("this is the ajax bobdy",req.body)
    Component.insertMany(req.body, function (err, docs) {
      if (err){
          return console.error(err);
          res.status(400).json(err);
      } else {       
        res.status(200).json(docs);
      }
    });
}


exports.inspection_type = function(req, res) {
    InspectionType.find({}, function(err, types){
        console.log("this are the types", req.params.id)
        
        res.render('Admin/dashboard/create_inspection_component', {layout: "layout/admin3", data:{inspection_type: types, mainType:req.params.id}})
    })
}












exports.component_parent = function(req, res) {
    InspectionType.find({}, function(err, types){
        console.log("this are the types", types)
        res.render('Admin/dashboard/component_parent', {layout: "layout/admin3", data:{inspection_type: types}})
    })
}

exports.inspection_category = function(req, res) {
    res.render('Admin/dashboard/inspection_category', {layout: "layout/admin3"})
}

exports.create_inspection_datasheet = function(req, res) {
    res.render('Admin/dashboard/create_inspection_datasheet', {layout: "layout/admin3"})
}



exports.mapview = function(req, res) {
    res.render('Admin/dashboard/map_view', {layout: "layout/admin3"})
}
exports.chart_page = function(req, res) {
    res.render('Admin/dashboard/chart', {layout: "layout/chatlayout"})
}

exports.report_page = function(req, res) {
    res.render('Admin/dashboard/report', {layout: "layout/form"})
}