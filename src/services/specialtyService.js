const res = require("express/lib/response")
const db = require("../models")

let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.contentHTML || !data.contentMarkDown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    contentMarkDown: data.contentHTML,
                    contentHTML: data.contentMarkDown,
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

let getSpecialties = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll()
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

let getDetailSpecialties = (dataInput, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataInput || !location) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input parameter"
                })
            } else {
                let data = {}
                data = await db.Specialty.findOne({
                    where: { id: dataInput },
                    attributes: ['contentHTML', 'contentMarkDown']
                })
                if (data) {
                    let arrDoctorBySpecialty = []
                    if (location === 'ALL') {
                        arrDoctorBySpecialty = await db.Doctor_info.findAll({
                            where: { specialtyId: dataInput },
                            attributes: ['doctorId', 'provinceId']
                        })
                    } else {
                        arrDoctorBySpecialty = await db.Doctor_info.findAll({
                            where: {
                                specialtyId: dataInput,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                    data.arrDoctorBySpecialty = arrDoctorBySpecialty
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
    createNewSpecialty, getSpecialties, getDetailSpecialties
}