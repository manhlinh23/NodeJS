import express from "express";
import homeController from "../controllers/homeController"
import userController from "../controllers/userController"
import doctorController from "../controllers/doctorController"
import patientController from "../controllers/patientController"
import specialtyController from "../controllers/specialtyController"

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAbout);
    router.get('/crud', homeController.getCRUD); // lay thong tin user

    router.post('/post-crud', homeController.postCRUD); // day thong tin user 
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-user', userController.handleGetAllUser)
    router.post('/api/create-new-user', userController.handleCreateUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.get('/api/allcode', userController.getAllCode)

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
    router.get('/api/get-all-doctor', doctorController.getAllDoctorsController)
    router.post('/api/create-infor-doctor', doctorController.createInforDoctorController)

    router.get('/api/get-detail-doctor', doctorController.getDetailDoctorsController)
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleDoctorByDate)
    router.get('/api/get-extra-info-doctor-by-id', doctorController.getExtraInfoDoctorById)
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateScheduleController)
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)

    router.post('/api/patient-book-appointment', patientController.postBookAppointment)
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment)

    router.post('/api/create-specialty', specialtyController.createNewSpecialty)
    router.get('/api/get-specialties', specialtyController.getSpecialties)
    router.get('/api/get-detail-specialties', specialtyController.getDetailSpecialties)



    return app.use("/", router);
}

module.exports = initWebRoutes;