import express from 'express';

//percentage_completion
import AdminDashboardController from '../controllers/dashboard/admin'
import AuthDashboard from '../controllers/auth';
import ApiController from '../controllers/api';

const router = express.Router();

router.route('/api/login')
    .post(ApiController.login_post)

router.route('/api/datasheet_select')
    .get(ApiController.datasheet_select)


router.route('/api/inspection_datasheet/:id')
    .get(ApiController.create_inspection_data_sheet)

router.route('/create_completed_datasheet/:name/:project_type')
    .get(ApiController.create_completed_datasheet)

router.route('/api/edit_single_component')
    .post(ApiController.edit_single_component)

router.route('/')
    .get(AdminDashboardController.home)

router.route('/')
    .get(AdminDashboardController.home)

router.route('/login')
    .get(AuthDashboard.login)
    .post(AuthDashboard.login_post)

router.route('/register_highway_inspector')
    .get(AuthDashboard.register_highway_inspector)
    .post(AuthDashboard.register_highway_inspector_post)

router.route('/register_post')
    .post(AuthDashboard.register_post)

router.route('/upload_multiple_inspection_datasheet')
    .get(AuthDashboard.upload_multiple_inspection_datasheet_get)
    .post(AuthDashboard.upload_multiple_inspection_datasheet_post)

router.route('/message_inspector')
    .get(AuthDashboard.message_inspector_get)
    .post(AuthDashboard.message_inspector_post)

router.route('/view_sent_messages_get')
    .get(AuthDashboard.view_sent_messages_get)
router.route('/view_recieved_messages_get')
    .get(AuthDashboard.view_recieved_messages_get)

router.route('/all_highway_inspectors')
    .get(AuthDashboard.all_highway_inspectors)

router.route('/create_completed_datasheet')
    .post(AuthDashboard.create_completed_datasheet)

router.route('/view_inspections')
    .get(AuthDashboard.view_inspections)

router.route('/broadcast_message')
    .post(AuthDashboard.broadcast_message)

router.route('/select_completed_type')
    .get(AuthDashboard.select_completed_type)

router.route('/read_messages_get/:id')
    .get(AuthDashboard.read_messages_get)

router.route('/all_inspections')
    .get(AdminDashboardController.all_inspections)
router.route('/highway_inspection')
    .get(AdminDashboardController.inspection_page)
router.route('/mapview')
    .get(AdminDashboardController.mapview)
router.route('/chart_page')
    .get(AdminDashboardController.chart_page)
router.route('/assign_highway_contracts')
    .get(AuthDashboard.assign_highway_contracts)
    .post(AuthDashboard.assign_highway_contracts_post)
router.route('/report_page')
    .get(AdminDashboardController.report_page)

router.route('/create_inspection_component')
    .get(AdminDashboardController.create_inspection_component)

router.route('/create_inspection_type/:id')
    .get(AdminDashboardController.create_inspection_type_get)

router.route('/create_inpsector_type_post')
    .post(AdminDashboardController.create_inpsector_type_post)

router.route('/create_inspection_datasheet')
    .get(AdminDashboardController.create_inspection_datasheet)

router.route('/upload_images_to_datasheet')
    .get(AuthDashboard.upload_images_to_datasheet)

router.route('/upload_images_to_datasheet_post')
    .post(AuthDashboard.upload_images_to_datasheet_post)

router.route('/upload_to_datasheet_post')
    .post(AuthDashboard.upload_to_datasheet_post)

router.route('/component_parent')
    .get(AdminDashboardController.component_parent)

router.route('/datasheet_select')
    .get(AuthDashboard.datasheet_select)

router.route('/datasheet_inspection_type/:id')
    .get(AuthDashboard.datasheet_inspection_type)

router.route('/edit_datasheet_report_post')
    .post(AuthDashboard.edit_datasheet_report_post)

router.route('/all_urgency')
    .get(AdminDashboardController.all_urgency)
    
//create_completed_inspection_datasheet
router.route('/create_completed_inspection_datasheet/:id')
    .post(AuthDashboard.create_completed_inspection_datasheet_post)

router.route('/finish_completed_datasheet/:id')
    .get(AuthDashboard.finish_completed_datasheet_get)
    .post(AuthDashboard.finish_completed_datasheet_post)

router.route('/view_completed_datasheet')
    .get(AuthDashboard.view_completed_datasheet)


router.route('/single_completed_datasheet/:id')
    .get(AuthDashboard.single_completed_datasheet)

router.route('/inspection_category')
    .get(AdminDashboardController.inspection_category )

router.route('/get_contract_datas/:contract_id')
    .get(AuthDashboard.get_contract_datas)

router.route('/inspection_report/:id/:datasheet_id')
    .get(AuthDashboard.inspection_report)



router.route('/completed_datasheet_inspection_type/:id/:project_type')
    .get(AuthDashboard.create_completed_inspection_datasheet)


router.route('/send_message_to_engineer_page/:id')
    .get(AuthDashboard.send_message_to_engineer_page)

    //inspection_type  //create_datasheet_report_post
router.route('/create_datasheet_report_post')
    .post(AuthDashboard.create_datasheet_report_post)

router.route('/all_highway_contracts_page/:id')
    .get(AuthDashboard.all_highway_contracts_page)

router.route('/changePassword')
    .get(AuthDashboard.changePassword_get)
    .post(AuthDashboard.changePassword_post)

router.route('/inspection_type/:id')
    .get(AdminDashboardController.inspection_type)

router.route('/create_component_type_post')
    .post(AdminDashboardController.create_component_type_post)
//create_component_type_post
//component_category.hbs
router.route('/modify_highway_contract_percentage')
    .get(AuthDashboard.modify_highway_contract_percentage)
    .post(AuthDashboard.modify_highway_contract_percentage_post)

//all_inspections //inspection_page
router.route('/success_type')
    .get(AdminDashboardController.success_type)

router.route('/success_component')
    .get(AdminDashboardController.success_component)

router.route('/create_inspection_data_sheet')
    .post(AuthDashboard.create_inspection_data_sheet)

router.route('/logout')
    .get(AuthDashboard.logout)


router.route('/edit_user_profile')
    .get(AuthDashboard.edit_user_profile_get)
    .post(AuthDashboard.edit_user_profile_post)

router.route('/delete_a_component/:id')
    .get(AuthDashboard.delete_a_component_get)



//this is highly dependent on the contract_id, so he selects the contracts he is assigned to and comments on it
//attach it to multiple images and comment

    


export default router;