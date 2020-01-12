import {encrypt, decrypt} from '../../../utility/encryptor'
import {redirector, admin_checker_redirector} from '../../../utility/redirector'
const fs = require("fs");


// TypeError: (0 , _index.AlexanderTheGreat) is not a function



const filePlacerAndNamer = (req, res, the_file) => {
    // let file_name = the_file.name
    let file_name = Date.now()+ the_file.name
    the_file.mv('views/public/uploads/' + file_name, function(err) {
   });
    return file_name
}

exports.home = function(req, res) {
    res.render('Admin/dashboard/index', {layout: "layout/admin3"})
}
exports.login = function(req, res) {
    res.render('Admin/dashboard/login-register', {layout: "layout/login-register", })
}
exports.register = function(req, res) {
    res.render('Admin/dashboard/login-register', {layout: "layout/login-register", })
}
exports.all_inspections = function(req, res) {
    res.render('Admin/dashboard/all_inspections', {layout: "layout/data_layout"})
}
exports.inspection_page = function(req, res) {
    res.render('Admin/dashboard/inspection_page', {layout: "layout/admin3"})
}
exports.inspection_page = function(req, res) {
    res.render('Admin/dashboard/map_view', {layout: "layout/admin3"})
}
exports.chart_page = function(req, res) {
    res.render('Admin/dashboard/chart', {layout: "layout/chatlayout"})
}