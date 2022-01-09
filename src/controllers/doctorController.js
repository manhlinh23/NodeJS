
import doctorService from '../services/doctorService'

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit //gioi han bac si
    if (!limit) limit = 10
    try {
        let response = await doctorService.getTopDoctorHome(+limit) //chuyen tu string sang int '3' -> +3
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}


let getAllDoctorsController = async (req, res) => {
    try {
        let response = await doctorService.getAllDoctorsService()
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let createInforDoctorController = async (req, res) => {
    try {
        let response = await doctorService.createInforDoctorService(req.body)
        console.log('check api: ', response);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let getDetailDoctorsController = async (req, res) => {
    try {
        let response = await doctorService.getDetailDoctorsService(req.query.id)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from controller...'
        })
    }
}

let bulkCreateScheduleController = async (req, res) => {
    try {
        let response = await doctorService.bulkCreateScheduleService(req.body)
        console.log('check api: ', response);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let getScheduleDoctorByDate = async (req, res) => {
    try {
        let response = await doctorService.getScheduleDoctorByDateService(req.query.doctorId, req.query.date)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from controller...'
        })
    }
}
let getExtraInfoDoctorById = async (req, res) => {
    try {
        let response = await doctorService.getExtraInfoDoctorById(req.query.doctorId)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from controller...'
        })
    }
}


module.exports = {
    getDetailDoctorsController, getTopDoctorHome,
    getAllDoctorsController, createInforDoctorController, bulkCreateScheduleController,
    getScheduleDoctorByDate, getExtraInfoDoctorById
}