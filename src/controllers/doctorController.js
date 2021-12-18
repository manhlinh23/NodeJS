
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

module.exports = { getTopDoctorHome, }