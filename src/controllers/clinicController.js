import clinicServices from '../services/clinicServices'

let createNewClinic = async (req, res) => {
    try {
        let response = await clinicServices.createNewClinic(req.body)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from controller...'
        })
    }
}

let getClinic = async (req, res) => {
    try {
        let response = await clinicServices.getClinic()
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from controller...'
        })
    }
}

let getDetailClinic = async (req, res) => {
    try {
        let response = await clinicServices.getDetailClinic(req.query.id)
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
    createNewClinic, getClinic, getDetailClinic
}