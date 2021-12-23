import db from "../models/index"

let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit, //gioi han lay
                where: { roleId: 'R2' }, //lay truong roleId co ma la R2
                order: [['createdAt', 'DESC']], // sap xep tu tren xuong duoi cua trường createdAt
                attributes: {
                    exclude: ['password'] // bo truong password
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] }, //gop 2 truong en va vi vao 1 truong tao moi la position Data
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getAllDoctorsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' }, //lay truong roleId co ma la R2
                attributes: {
                    exclude: ['password', 'image'] // bo truong password
                },
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (error) {
            reject(error)
        }
    })
}

let createInforDoctorService = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId
                || !inputData.contentHTML
                || !inputData.contentMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input parameters'
                })
            } else {
                await db.Markdown.create({
                    doctorId: inputData.doctorId,
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Create succed'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailDoctorsService = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing input parameters'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputData }, //lay truong roleId co ma la R2
                    attributes: {
                        exclude: ['password', 'image'] // bo truong password
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML'
                                , 'contentMarkdown']
                        }, //gop 2 truong en va vi vao 1 truong tao moi la position Data
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    raw: true,
                    nest: true
                })

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctorsService: getAllDoctorsService,
    createInforDoctorService: createInforDoctorService,
    getDetailDoctorsService: getDetailDoctorsService,
}