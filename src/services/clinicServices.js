const db = require("../models")

let createNewClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.imageBase64 || !data.contentHTML || !data.contentMarkDown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    image: data.imageBase64,
                    contentMarkDown: data.contentHTML,
                    contentHTML: data.contentMarkDown,
                    address: data.address
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Succeed'
                })
            }

        } catch (error) {
            reject(error)
        }

    })
}


let getClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll()
            if (data && data.length > 0) {
                data.map((item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary')
                }))
            }
            resolve({
                errCode: 0,
                data
            })

        } catch (e) {
            reject(e)
        }
    })
}

let getDetailClinic = (dataInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input parameter"
                })
            } else {
                let data = {}
                data = await db.Clinic.findOne({
                    where: { id: dataInput },
                    attributes: ['contentHTML', 'contentMarkDown', 'address', 'name']
                })
                if (data) {
                    let arrDoctorByClinic = []
                    arrDoctorByClinic = await db.Doctor_info.findAll({
                        where: { clinicId: dataInput },
                        attributes: ['doctorId', 'provinceId']
                    })

                    data.arrDoctorByClinic = arrDoctorByClinic
                } else {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Succeed',
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createNewClinic, getClinic, getDetailClinic
}