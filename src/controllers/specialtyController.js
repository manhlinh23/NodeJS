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

module.exports = {
    createNewSpecialty
}