import specialtyService from '../services/specialtyService'

let createNewSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.createNewSpecialty(req.body)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from controller...'
        })
    }
}
let getSpecialties = async (req, res) => {
    try {
        let response = await specialtyService.getSpecialties()
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from controller...'
        })
    }
}
let getDetailSpecialties = async (req, res) => {
    try {
        let response = await specialtyService.getDetailSpecialties(req.query.id, req.query.location)
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
    createNewSpecialty, getSpecialties, getDetailSpecialties
}