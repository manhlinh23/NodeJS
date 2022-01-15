import patientServices from '../services/patientServices'

let postBookAppointment = async (req, res) => {
    try {
        let response = await patientServices.postBookAppointment(req.body)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let postVerifyBookAppointment = async (req, res) => {
    try {
        let response = await patientServices.postVerifyBookAppointment(req.body)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

module.exports = {
    postBookAppointment, postVerifyBookAppointment
}