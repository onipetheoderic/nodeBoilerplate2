import express from 'express';

//percentage_completion
import AdminDashboardController from '../controllers/dashboard/admin'
import AuthDashboard from '../controllers/auth';


const router = express.Router();



router.route('/')
    .get(AdminDashboardController.home)
router.route('/login')
    .get(AuthDashboard.login)
    .post(AuthDashboard.login_post)

router.route('/register_highway_inspector')
    .get(AuthDashboard.register_highway_inspector)
    .post(AuthDashboard.register_highway_inspector_post)


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

router.route('/modify_highway_contract_percentage')
    .get(AuthDashboard.modify_highway_contract_percentage)
    .post(AuthDashboard.modify_highway_contract_percentage_post)

//all_inspections //inspection_page

export default router;