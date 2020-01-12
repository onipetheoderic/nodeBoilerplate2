import express from 'express';


import AdminDashboardController from '../controllers/dashboard/admin'
import ClientDashboardController from '../controllers/dashboard/client'

const router = express.Router();

router.route('/client_dashboard')
    .get(ClientDashboardController.home)

router.route('/')
    .get(AdminDashboardController.home)
router.route('/login')
    .get(AdminDashboardController.login)
router.route('/register')
    .get(AdminDashboardController.register)
router.route('/all_inspections')
    .get(AdminDashboardController.all_inspections)
router.route('/highway_inspection')
    .get(AdminDashboardController.inspection_page)
router.route('/mapview')
    .get(AdminDashboardController.inspection_page)
router.route('/chart_page')
    .get(AdminDashboardController.chart_page)

//all_inspections //inspection_page

export default router;